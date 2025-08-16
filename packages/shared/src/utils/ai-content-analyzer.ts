import type { Recipe } from '../types/recipe';

/**
 * Contextual question with confidence scoring
 */
export interface ContextualQuestion {
  question: string;
  confidence: number; // 0-1 probability user will ask
  category: string; // temperature, substitution, technique, etc.
  trigger: string; // What in the recipe triggered this
  priority: number; // Internal priority for sorting
}

/**
 * Pattern matching result
 */
interface PatternMatch<T = string> {
  pattern: T;
  match: RegExpMatchArray;
  confidence: number;
  category: string;
  trigger: string;
}

/**
 * Generic pattern definition with confidence scoring
 */
interface PatternDefinition<T = string> {
  patterns: T[];
  generator: (match: string, trigger: string) => string;
  confidence: number;
  category: string;
}

/**
 * Romanian pattern definitions for content analysis
 */
const ROMANIAN_PATTERNS = {
  temperature: {
    patterns: [
      /(\d+)\s*°C/g,
      /(\d+)\s*grade\s*(celsius|c)?/gi,
      /cuptor\s+(cald|fierbinte|(\d+)\s*grade)/gi,
      /temperatura\s+de\s+(\d+)/gi,
      /la\s+(\d+)\s*grade/gi,
    ],
    generator: (match: string, trigger: string) => `Cât înseamnă ${match} în Fahrenheit?`,
    confidence: 0.85,
    category: 'temperature',
  } as PatternDefinition<RegExp>,

  substitution: {
    patterns: [
      'unt',
      'untul',
      'untură',
      'ouă',
      'ou',
      'oule',
      'oul',
      'smântână',
      'smantana',
      'frișcă',
      'drojdie',
      'drojdia',
      'maya',
      'făină',
      'faina',
      'făina albă',
      'zahăr',
      'zahar',
      'zahărul',
      'lapte',
      'laptele',
      'lapte de vacă',
      'ulei',
      'uleiul',
      'ulei de măsline',
      'parmezan',
      'brânză',
      'branza',
      'vin',
      'vinul',
      'vin alb',
      'vin roșu',
    ],
    generator: (match: string, trigger: string) => `Cu ce pot înlocui ${match}?`,
    confidence: 0.9,
    category: 'substitution',
  } as PatternDefinition,

  techniques: {
    patterns: [
      'blanșa',
      'blanșare',
      'blanșat',
      'carameliza',
      'caramelizare',
      'caramelizat',
      'flambe',
      'flambat',
      'sous vide',
      'sous-vide',
      'julienne',
      'julien',
      'bain-marie',
      'bain marie',
      'brunoise',
      'chiffonade',
      'glacé',
      'glace',
      'confit',
      'confiat',
      'marinare',
      'marinat',
    ],
    generator: (match: string, trigger: string) => {
      const techniqueQuestions: Record<string, string> = {
        blanșa: 'Ce înseamnă să blanșezi?',
        carameliza: 'Cum caramelizez corect?',
        flambe: 'Ce este tehnica flambe?',
        'sous vide': 'Ce este sous vide?',
        julienne: 'Cum tai julienne?',
        'bain-marie': 'Ce este bain-marie?',
        brunoise: 'Ce este tăierea brunoise?',
        chiffonade: 'Ce este tehnica chiffonade?',
        glacé: 'Ce înseamnă glacé?',
        confit: 'Ce este tehnica confit?',
        marinare: 'Cum marinlez corect?',
      };

      const normalizedMatch = match.toLowerCase().replace(/[-\s]/g, '');
      const foundKey = Object.keys(techniqueQuestions).find((key) =>
        normalizedMatch.includes(key.replace(/[-\s]/g, ''))
      );

      return foundKey ? techniqueQuestions[foundKey] : `Ce este tehnica ${match}?`;
    },
    confidence: 0.75,
    category: 'technique',
  } as PatternDefinition,

  timing: {
    patterns: [
      /(\d+)\s*(minute|min)/gi,
      /(\d+)\s*(ore|oră|h)/gi,
      /(\d+)\s*(secunde|sec)/gi,
      /până\s+când/gi,
      /până\s+este\s+gata/gi,
      /cât\s+timp/gi,
    ],
    generator: (match: string, trigger: string) => `Este exact ${match} sau pot ajusta timpul?`,
    confidence: 0.7,
    category: 'timing',
  } as PatternDefinition<RegExp>,

  equipment: {
    patterns: [
      'termometru',
      'termometrul',
      'mixer',
      'mixerul',
      'blender',
      'robot',
      'robotul',
      'robot de bucătărie',
      'mandolină',
      'mandolina',
      'sous vide machine',
      'aparatul sous vide',
      'processor',
      'procesorul',
      'stand mixer',
      'planetary',
    ],
    generator: (match: string, trigger: string) => `Pot face rețeta fără ${match}?`,
    confidence: 0.65,
    category: 'equipment',
  } as PatternDefinition,

  measurements: {
    patterns: [
      /(\d+)\s*cup[s]?/gi,
      /(\d+)\s*tbsp/gi,
      /(\d+)\s*tsp/gi,
      /(\d+)\s*oz/gi,
      /(\d+)\s*lb[s]?/gi,
      /(\d+)\s*inch/gi,
      /(\d+)\s*ft/gi,
    ],
    generator: (match: string, trigger: string) => `Cât înseamnă ${match} în sistem metric?`,
    confidence: 0.8,
    category: 'measurement',
  } as PatternDefinition<RegExp>,

  difficulty: {
    patterns: [
      'complicat',
      'complicată',
      'dificil',
      'dificilă',
      'complex',
      'complexă',
      'avansat',
      'avansată',
      'profesional',
      'profesională',
      'expert',
      'timp îndelungat',
      'multe pași',
      'mulți pași',
    ],
    generator: (match: string, trigger: string) => 'Este rețeta dificilă pentru începători?',
    confidence: 0.6,
    category: 'difficulty',
  } as PatternDefinition,
} as const;

/**
 * Performance monitoring for content analysis
 */
interface PerformanceMetrics {
  analysisTime: number;
  patternsChecked: number;
  questionsGenerated: number;
}

/**
 * Content analyzer configuration
 */
interface ContentAnalyzerConfig {
  maxQuestions: number;
  minConfidence: number;
  performanceTarget: number; // ms
  enablePerformanceLogging: boolean;
}

/**
 * Advanced content analyzer service for recipe analysis
 */
export class ContentAnalyzer {
  private static readonly DEFAULT_CONFIG: ContentAnalyzerConfig = {
    maxQuestions: 5,
    minConfidence: 0.7,
    performanceTarget: 50, // 50ms target
    enablePerformanceLogging: process.env.NODE_ENV === 'development',
  };

  private readonly config: ContentAnalyzerConfig;
  private performanceMetrics: PerformanceMetrics[] = [];

  constructor(config: Partial<ContentAnalyzerConfig> = {}) {
    this.config = { ...ContentAnalyzer.DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze recipe content and generate contextual questions
   */
  analyzeRecipe(recipe: Recipe): ContextualQuestion[] {
    const startTime = performance.now();
    const questions: ContextualQuestion[] = [];
    let patternsChecked = 0;

    try {
      // Temperature analysis
      const tempQuestions = this.analyzeTemperature(recipe);
      questions.push(...tempQuestions);
      patternsChecked += ROMANIAN_PATTERNS.temperature.patterns.length;

      // Substitution analysis
      const substitutionQuestions = this.analyzeSubstitutions(recipe);
      questions.push(...substitutionQuestions);
      patternsChecked += ROMANIAN_PATTERNS.substitution.patterns.length;

      // Technique analysis
      const techniqueQuestions = this.analyzeTechniques(recipe);
      questions.push(...techniqueQuestions);
      patternsChecked += ROMANIAN_PATTERNS.techniques.patterns.length;

      // Timing analysis
      const timingQuestions = this.analyzeTiming(recipe);
      questions.push(...timingQuestions);
      patternsChecked += ROMANIAN_PATTERNS.timing.patterns.length;

      // Equipment analysis
      const equipmentQuestions = this.analyzeEquipment(recipe);
      questions.push(...equipmentQuestions);
      patternsChecked += ROMANIAN_PATTERNS.equipment.patterns.length;

      // Measurement analysis
      const measurementQuestions = this.analyzeMeasurements(recipe);
      questions.push(...measurementQuestions);
      patternsChecked += ROMANIAN_PATTERNS.measurements.patterns.length;

      // Difficulty analysis
      const difficultyQuestions = this.analyzeDifficulty(recipe);
      questions.push(...difficultyQuestions);
      patternsChecked += ROMANIAN_PATTERNS.difficulty.patterns.length;

      // Sort by confidence and priority, then filter
      const filteredQuestions = questions
        .filter((q) => q.confidence >= this.config.minConfidence)
        .sort((a, b) => {
          // Primary sort: confidence (higher first)
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          // Secondary sort: category priority
          return this.getCategoryPriority(b.category) - this.getCategoryPriority(a.category);
        })
        .slice(0, this.config.maxQuestions);

      // Add priority values based on final ranking
      filteredQuestions.forEach((question, index) => {
        question.priority = filteredQuestions.length - index;
      });

      const endTime = performance.now();
      const analysisTime = endTime - startTime;

      // Track performance metrics
      this.trackPerformance({
        analysisTime,
        patternsChecked,
        questionsGenerated: filteredQuestions.length,
      });

      return filteredQuestions;
    } catch (error) {
      console.error('Content analysis failed:', error);
      return [];
    }
  }

  /**
   * Generate warmup questions with specified limit
   */
  generateWarmupQuestions(recipe: Recipe, limit: number = 3): string[] {
    const contextualQuestions = this.analyzeRecipe(recipe);
    return contextualQuestions.slice(0, limit).map((q) => q.question);
  }

  /**
   * Get predicted probability for a specific question
   */
  getPredictedQuestionProbability(recipe: Recipe, question: string): number {
    const contextualQuestions = this.analyzeRecipe(recipe);
    const normalizedInput = this.normalizeText(question);

    // First try exact match
    const exactMatch = contextualQuestions.find(
      (q) => this.normalizeText(q.question) === normalizedInput
    );

    if (exactMatch) {
      return exactMatch.confidence;
    }

    // Then try similarity match
    const similarMatch = contextualQuestions.find(
      (q) => this.calculateSimilarity(normalizedInput, this.normalizeText(q.question)) > 0.7
    );

    if (similarMatch) {
      return similarMatch.confidence * 0.8; // Reduce confidence for similarity match
    }

    return 0;
  }

  /**
   * Analyze temperature mentions in recipe
   */
  private analyzeTemperature(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.temperature.patterns;
    const content = `${recipe.instructions} ${recipe.description || ''}`;

    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const temperature = match[1] || match[2] || match[0];
        const trigger = match[0];

        questions.push({
          question: ROMANIAN_PATTERNS.temperature.generator(temperature, trigger),
          confidence: ROMANIAN_PATTERNS.temperature.confidence,
          category: ROMANIAN_PATTERNS.temperature.category,
          trigger,
          priority: 0, // Will be set later
        });
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze ingredients for common substitutions
   */
  private analyzeSubstitutions(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.substitution.patterns;

    for (const ingredient of recipe.ingredients) {
      const normalizedIngredient = this.normalizeText(ingredient);

      for (const pattern of patterns) {
        if (normalizedIngredient.includes(this.normalizeText(pattern))) {
          // Extract the specific ingredient form from the recipe
          const words = ingredient.toLowerCase().split(' ');
          const matchedWord =
            words.find((word) => this.normalizeText(word).includes(this.normalizeText(pattern))) ||
            pattern;

          questions.push({
            question: ROMANIAN_PATTERNS.substitution.generator(matchedWord, ingredient),
            confidence: ROMANIAN_PATTERNS.substitution.confidence,
            category: ROMANIAN_PATTERNS.substitution.category,
            trigger: ingredient,
            priority: 0,
          });
          break; // Only one substitution question per ingredient
        }
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze cooking techniques mentioned
   */
  private analyzeTechniques(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.techniques.patterns;
    const content = `${recipe.instructions} ${recipe.description || ''}`.toLowerCase();

    for (const pattern of patterns) {
      if (content.includes(pattern.toLowerCase())) {
        questions.push({
          question: ROMANIAN_PATTERNS.techniques.generator(pattern, pattern),
          confidence: ROMANIAN_PATTERNS.techniques.confidence,
          category: ROMANIAN_PATTERNS.techniques.category,
          trigger: pattern,
          priority: 0,
        });
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze timing mentions
   */
  private analyzeTiming(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.timing.patterns;
    const content = `${recipe.instructions} ${recipe.description || ''}`;

    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const timing = match[0];

        questions.push({
          question: ROMANIAN_PATTERNS.timing.generator(timing, timing),
          confidence: ROMANIAN_PATTERNS.timing.confidence,
          category: ROMANIAN_PATTERNS.timing.category,
          trigger: timing,
          priority: 0,
        });
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze special equipment mentions
   */
  private analyzeEquipment(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.equipment.patterns;
    const content = `${recipe.instructions} ${recipe.description || ''}`.toLowerCase();

    for (const pattern of patterns) {
      const normalizedPattern = pattern.toLowerCase();
      if (content.includes(normalizedPattern)) {
        questions.push({
          question: ROMANIAN_PATTERNS.equipment.generator(pattern, pattern),
          confidence: ROMANIAN_PATTERNS.equipment.confidence,
          category: ROMANIAN_PATTERNS.equipment.category,
          trigger: pattern,
          priority: 0,
        });
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze measurement conversions needed
   */
  private analyzeMeasurements(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.measurements.patterns;
    const content = `${recipe.instructions} ${recipe.ingredients.join(' ')}`;

    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const measurement = match[0];

        questions.push({
          question: ROMANIAN_PATTERNS.measurements.generator(measurement, measurement),
          confidence: ROMANIAN_PATTERNS.measurements.confidence,
          category: ROMANIAN_PATTERNS.measurements.category,
          trigger: measurement,
          priority: 0,
        });
      }
    }

    return this.deduplicateQuestions(questions);
  }

  /**
   * Analyze difficulty indicators
   */
  private analyzeDifficulty(recipe: Recipe): ContextualQuestion[] {
    const questions: ContextualQuestion[] = [];
    const patterns = ROMANIAN_PATTERNS.difficulty.patterns;
    const content = `${recipe.instructions} ${recipe.description || ''}`.toLowerCase();

    // Check recipe metadata first - Romanian difficulty terms
    if (
      recipe.difficulty &&
      ['dificil', 'foarte dificil', 'complex', 'avansat', 'hard', 'expert', 'advanced'].some(
        (term) => recipe.difficulty!.toLowerCase().includes(term)
      )
    ) {
      questions.push({
        question: 'Este rețeta dificilă pentru începători?',
        confidence: 0.8,
        category: 'difficulty',
        trigger: `difficulty: ${recipe.difficulty}`,
        priority: 0,
      });
      return questions;
    }

    // Check for difficulty indicators in text
    let difficultyIndicators = 0;
    for (const pattern of patterns) {
      if (content.includes(pattern.toLowerCase())) {
        difficultyIndicators++;
      }
    }

    // Check for complexity indicators
    const complexityIndicators = [
      recipe.instructions.split('.').length > 10, // Many steps
      (recipe.prepTime || 0) + (recipe.cookTime || 0) > 120, // Long time
      recipe.ingredients.length > 15, // Many ingredients
    ].filter(Boolean).length;

    if (difficultyIndicators > 0 || complexityIndicators >= 2) {
      questions.push({
        question: ROMANIAN_PATTERNS.difficulty.generator('', 'complexity indicators'),
        confidence: Math.min(0.6 + difficultyIndicators * 0.1 + complexityIndicators * 0.05, 0.9),
        category: ROMANIAN_PATTERNS.difficulty.category,
        trigger: `${difficultyIndicators} difficulty indicators, ${complexityIndicators} complexity indicators`,
        priority: 0,
      });
    }

    return questions;
  }

  /**
   * Remove duplicate questions based on normalized content
   */
  private deduplicateQuestions(questions: ContextualQuestion[]): ContextualQuestion[] {
    const seen = new Set<string>();
    return questions.filter((question) => {
      const normalized = this.normalizeText(question.question);
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  /**
   * Normalize text for comparison (remove diacritics, punctuation, normalize whitespace)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[ăâîșțĂÂÎȘȚ]/g, (char) => {
        const map: Record<string, string> = {
          ă: 'a',
          â: 'a',
          î: 'i',
          ș: 's',
          ț: 't',
          Ă: 'a',
          Â: 'a',
          Î: 'i',
          Ș: 's',
          Ț: 't',
        };
        return map[char] || char;
      })
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate text similarity using simple overlap ratio
   */
  private calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;

    const words1 = new Set(text1.split(' ').filter((w) => w.length > 2));
    const words2 = new Set(text2.split(' ').filter((w) => w.length > 2));

    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Get category priority for sorting
   */
  private getCategoryPriority(category: string): number {
    const priorities: Record<string, number> = {
      substitution: 1000,
      temperature: 800,
      measurement: 700,
      technique: 600,
      timing: 500,
      equipment: 400,
      difficulty: 300,
    };
    return priorities[category] || 0;
  }

  /**
   * Track performance metrics
   */
  private trackPerformance(metrics: PerformanceMetrics): void {
    this.performanceMetrics.push(metrics);

    // Keep only last 100 measurements
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }

    if (this.config.enablePerformanceLogging) {
      if (metrics.analysisTime > this.config.performanceTarget) {
        console.warn(
          `Content analysis took ${metrics.analysisTime.toFixed(2)}ms, ` +
            `exceeding ${this.config.performanceTarget}ms target. ` +
            `Checked ${metrics.patternsChecked} patterns, generated ${metrics.questionsGenerated} questions.`
        );
      } else if (process.env.NODE_ENV === 'development') {
        console.log(
          `Content analysis completed in ${metrics.analysisTime.toFixed(2)}ms. ` +
            `Generated ${metrics.questionsGenerated} questions from ${metrics.patternsChecked} patterns.`
        );
      }
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averageTime: number;
    maxTime: number;
    minTime: number;
    totalAnalyses: number;
    performanceTarget: number;
    exceedsTargetPercent: number;
  } {
    if (this.performanceMetrics.length === 0) {
      return {
        averageTime: 0,
        maxTime: 0,
        minTime: 0,
        totalAnalyses: 0,
        performanceTarget: this.config.performanceTarget,
        exceedsTargetPercent: 0,
      };
    }

    const times = this.performanceMetrics.map((m) => m.analysisTime);
    const exceedsTarget = times.filter((t) => t > this.config.performanceTarget).length;

    return {
      averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      maxTime: Math.max(...times),
      minTime: Math.min(...times),
      totalAnalyses: this.performanceMetrics.length,
      performanceTarget: this.config.performanceTarget,
      exceedsTargetPercent: (exceedsTarget / times.length) * 100,
    };
  }
}

/**
 * Content analyzer service interface
 */
export interface ContentAnalyzerService {
  analyzeRecipe(recipe: Recipe): ContextualQuestion[];
  generateWarmupQuestions(recipe: Recipe, limit?: number): string[];
  getPredictedQuestionProbability(recipe: Recipe, question: string): number;
  getPerformanceStats(): {
    averageTime: number;
    maxTime: number;
    minTime: number;
    totalAnalyses: number;
    performanceTarget: number;
    exceedsTargetPercent: number;
  };
}

/**
 * Singleton instance
 */
let contentAnalyzerInstance: ContentAnalyzer | null = null;

/**
 * Get the content analyzer service instance
 */
export function getContentAnalyzerService(): ContentAnalyzerService {
  if (!contentAnalyzerInstance) {
    contentAnalyzerInstance = new ContentAnalyzer();
  }
  return contentAnalyzerInstance;
}

/**
 * Reset the content analyzer service (useful for testing)
 */
export function resetContentAnalyzerService(): void {
  contentAnalyzerInstance = null;
}

/**
 * Convenience function to analyze recipe content
 */
export function analyzeRecipeContent(recipe: Recipe): ContextualQuestion[] {
  const service = getContentAnalyzerService();
  return service.analyzeRecipe(recipe);
}

export default ContentAnalyzer;
