/**
 * Anti-bot protection utilities
 * Provides multiple layers of bot detection and prevention
 */

/**
 * Bot detection state
 */
export interface BotDetectionState {
  isBot: boolean;
  confidence: number; // 0-1 scale
  reasons: string[];
  timestamp: number;
}

/**
 * Anti-bot configuration
 */
export interface AntiBotConfig {
  minSubmissionDelay: number; // Minimum time before submission (ms)
  honeypotFieldName: string;
  enableTimingAnalysis: boolean;
  enableBehaviorAnalysis: boolean;
  maxSubmissionRate: number; // Max submissions per minute
}

export const DEFAULT_ANTI_BOT_CONFIG: AntiBotConfig = {
  minSubmissionDelay: 800, // 800ms minimum delay
  honeypotFieldName: 'company_website', // Innocent looking field name
  enableTimingAnalysis: true,
  enableBehaviorAnalysis: true,
  maxSubmissionRate: 5, // 5 submissions per minute max
};

/**
 * Anti-bot protection hook state
 */
export interface AntiBotHookState {
  isReady: boolean;
  timeToSubmission: number;
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  checkBotBehavior: () => BotDetectionState;
  resetState: () => void;
}

/**
 * Submission timing tracker
 */
class SubmissionTimingTracker {
  private startTime: number = 0;
  private keystrokes: number = 0;
  private lastKeystroke: number = 0;
  private focusTime: number = 0;
  private unfocusedTime: number = 0;
  
  public start(): void {
    this.startTime = Date.now();
    this.keystrokes = 0;
    this.lastKeystroke = 0;
    this.focusTime = 0;
    this.unfocusedTime = 0;
  }
  
  public recordKeystroke(): void {
    const now = Date.now();
    this.keystrokes++;
    this.lastKeystroke = now;
  }
  
  public recordFocus(): void {
    this.focusTime = Date.now();
  }
  
  public recordBlur(): void {
    if (this.focusTime > 0) {
      this.unfocusedTime += Date.now() - this.focusTime;
    }
  }
  
  public getMetrics() {
    const now = Date.now();
    const totalTime = now - this.startTime;
    const timeSinceLastKeystroke = this.lastKeystroke > 0 ? now - this.lastKeystroke : totalTime;
    
    return {
      totalTime,
      keystrokes: this.keystrokes,
      avgKeystrokeInterval: this.keystrokes > 1 ? totalTime / this.keystrokes : 0,
      timeSinceLastKeystroke,
      unfocusedPercentage: totalTime > 0 ? this.unfocusedTime / totalTime : 0,
    };
  }
}

/**
 * Rate limiting tracker
 */
class RateLimitTracker {
  private submissions: number[] = [];
  
  public recordSubmission(): void {
    const now = Date.now();
    this.submissions.push(now);
    
    // Clean old submissions (older than 1 minute)
    this.submissions = this.submissions.filter(time => now - time < 60000);
  }
  
  public getSubmissionCount(windowMs: number = 60000): number {
    const now = Date.now();
    return this.submissions.filter(time => now - time < windowMs).length;
  }
  
  public isRateLimited(maxRate: number, windowMs: number = 60000): boolean {
    return this.getSubmissionCount(windowMs) >= maxRate;
  }
}

// Global instances
const timingTracker = new SubmissionTimingTracker();
const rateLimitTracker = new RateLimitTracker();

/**
 * Analyze submission behavior for bot detection
 */
export function analyzeBotBehavior(config: AntiBotConfig = DEFAULT_ANTI_BOT_CONFIG): BotDetectionState {
  const reasons: string[] = [];
  let confidence = 0;
  
  // Check rate limiting
  if (rateLimitTracker.isRateLimited(config.maxSubmissionRate)) {
    reasons.push('Rate limited: too many submissions');
    confidence += 0.8;
  }
  
  if (config.enableTimingAnalysis) {
    const metrics = timingTracker.getMetrics();
    
    // Too fast submission (likely bot)
    if (metrics.totalTime < config.minSubmissionDelay) {
      reasons.push(`Too fast submission: ${metrics.totalTime}ms < ${config.minSubmissionDelay}ms`);
      confidence += 0.9;
    }
    
    // No keystrokes (likely programmatic)
    if (metrics.keystrokes === 0 && metrics.totalTime > 1000) {
      reasons.push('No user interaction detected');
      confidence += 0.7;
    }
    
    // Extremely regular keystroke intervals (bot-like)
    if (metrics.keystrokes > 5 && metrics.avgKeystrokeInterval > 0) {
      const intervalVariation = Math.abs(metrics.avgKeystrokeInterval - 100); // Bots often type at ~100ms intervals
      if (intervalVariation < 10) {
        reasons.push('Regular keystroke pattern detected');
        confidence += 0.6;
      }
    }
    
    // Too much unfocused time (likely bot opening multiple tabs)
    if (metrics.unfocusedPercentage > 0.8) {
      reasons.push('Excessive unfocused time');
      confidence += 0.4;
    }
  }
  
  // Normalize confidence to 0-1
  confidence = Math.min(confidence, 1);
  
  return {
    isBot: confidence > 0.5,
    confidence,
    reasons,
    timestamp: Date.now(),
  };
}

/**
 * Honeypot validation
 */
export function validateHoneypot(honeypotValue: string): boolean {
  // Honeypot should always be empty for legitimate users
  return honeypotValue === '' || honeypotValue == null;
}

/**
 * Start bot detection tracking
 */
export function startBotDetection(): void {
  timingTracker.start();
}

/**
 * Record user interaction events
 */
export function recordKeystroke(): void {
  timingTracker.recordKeystroke();
}

export function recordFocus(): void {
  timingTracker.recordFocus();
}

export function recordBlur(): void {
  timingTracker.recordBlur();
}

/**
 * Record submission attempt for rate limiting
 */
export function recordSubmissionAttempt(): void {
  rateLimitTracker.recordSubmission();
}

/**
 * Check if user can submit (not rate limited)
 */
export function canSubmit(config: AntiBotConfig = DEFAULT_ANTI_BOT_CONFIG): boolean {
  return !rateLimitTracker.isRateLimited(config.maxSubmissionRate);
}

/**
 * Get time until user can submit
 */
export function getTimeUntilSubmission(startTime: number, config: AntiBotConfig = DEFAULT_ANTI_BOT_CONFIG): number {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, config.minSubmissionDelay - elapsed);
  return remaining;
}

/**
 * Comprehensive bot check for form submission
 */
export function performBotCheck(
  honeypotValue: string,
  config: AntiBotConfig = DEFAULT_ANTI_BOT_CONFIG
): {
  isAllowed: boolean;
  botDetection: BotDetectionState;
  honeypotValid: boolean;
  rateLimitOk: boolean;
} {
  const honeypotValid = validateHoneypot(honeypotValue);
  const rateLimitOk = canSubmit(config);
  const botDetection = analyzeBotBehavior(config);
  
  const isAllowed = honeypotValid && rateLimitOk && !botDetection.isBot;
  
  return {
    isAllowed,
    botDetection,
    honeypotValid,
    rateLimitOk,
  };
}

/**
 * Generate honeypot field attributes
 */
export function generateHoneypotField(config: AntiBotConfig = DEFAULT_ANTI_BOT_CONFIG) {
  return {
    name: config.honeypotFieldName,
    id: config.honeypotFieldName,
    tabIndex: -1,
    autoComplete: 'off',
    'aria-hidden': true,
    style: {
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      opacity: 0,
      pointerEvents: 'none',
    } as React.CSSProperties,
  };
}