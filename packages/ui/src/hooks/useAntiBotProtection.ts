'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  DEFAULT_ANTI_BOT_CONFIG,
  startBotDetection,
  recordKeystroke,
  recordFocus,
  recordBlur,
  performBotCheck,
  getTimeUntilSubmission,
  generateHoneypotField,
  type AntiBotConfig,
  type BotDetectionState,
  type AntiBotHookState
} from '@coquinate/shared';

interface UseAntiBotProtectionOptions {
  config?: Partial<AntiBotConfig>;
  onBotDetected?: (detection: BotDetectionState) => void;
  autoStart?: boolean;
}

/**
 * Hook pentru protecție anti-bot cu multiple straturi de detectare
 * Oferă honeypot, timing analysis, behavior tracking și rate limiting
 */
export function useAntiBotProtection({
  config = {},
  onBotDetected,
  autoStart = true
}: UseAntiBotProtectionOptions = {}): AntiBotHookState & {
  honeypotFieldProps: React.InputHTMLAttributes<HTMLInputElement>;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onInputKeyDown: () => void;
  canSubmit: boolean;
  submitCheck: () => { isAllowed: boolean; botDetection: BotDetectionState };
} {
  const fullConfig = { ...DEFAULT_ANTI_BOT_CONFIG, ...config };
  const startTimeRef = useRef<number>(0);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [timeToSubmission, setTimeToSubmission] = useState(fullConfig.minSubmissionDelay);
  const [isReady, setIsReady] = useState(false);

  // Inițializează tracking-ul
  const initializeTracking = useCallback(() => {
    startTimeRef.current = Date.now();
    startBotDetection();
    setIsReady(false);
    setTimeToSubmission(fullConfig.minSubmissionDelay);
  }, [fullConfig.minSubmissionDelay]);

  // Auto-start dacă este configurat
  useEffect(() => {
    if (autoStart) {
      initializeTracking();
    }
  }, [autoStart, initializeTracking]);

  // Update timer pentru submission delay
  useEffect(() => {
    if (startTimeRef.current === 0) return;

    const interval = setInterval(() => {
      const remaining = getTimeUntilSubmission(startTimeRef.current, fullConfig);
      setTimeToSubmission(remaining);
      
      if (remaining === 0 && !isReady) {
        setIsReady(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTimeRef.current, fullConfig, isReady]);

  // Event handlers pentru tracking user behavior
  const onInputFocus = useCallback(() => {
    recordFocus();
  }, []);

  const onInputBlur = useCallback(() => {
    recordBlur();
  }, []);

  const onInputKeyDown = useCallback(() => {
    recordKeystroke();
  }, []);

  // Honeypot field props
  const honeypotFieldProps = {
    ...generateHoneypotField(fullConfig),
    value: honeypotValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setHoneypotValue(e.target.value);
    },
  };

  // Check bot behavior
  const checkBotBehavior = useCallback((): BotDetectionState => {
    const result = performBotCheck(honeypotValue, fullConfig);
    return result.botDetection;
  }, [honeypotValue, fullConfig]);

  // Submit check
  const submitCheck = useCallback(() => {
    const result = performBotCheck(honeypotValue, fullConfig);
    
    if (result.botDetection.isBot && onBotDetected) {
      onBotDetected(result.botDetection);
    }
    
    return {
      isAllowed: result.isAllowed,
      botDetection: result.botDetection,
    };
  }, [honeypotValue, fullConfig, onBotDetected]);

  // Reset state
  const resetState = useCallback(() => {
    setHoneypotValue('');
    setIsReady(false);
    initializeTracking();
  }, [initializeTracking]);

  return {
    // Core state
    isReady,
    timeToSubmission,
    honeypotValue,
    setHoneypotValue,
    checkBotBehavior,
    resetState,
    
    // Event handlers
    honeypotFieldProps,
    onInputFocus,
    onInputBlur,
    onInputKeyDown,
    
    // Submit helpers
    canSubmit: isReady && timeToSubmission === 0,
    submitCheck,
  };
}