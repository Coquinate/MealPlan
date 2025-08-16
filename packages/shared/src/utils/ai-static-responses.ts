/**
 * Static Common Responses Service
 * Provides instant answers for recipe-agnostic questions to avoid AI API calls
 * Performance target: <10ms lookup time
 */

import { normalizeRomanianQuestion } from './ai-cache-service';

export interface StaticResponse {
  patterns: string[]; // Normalized patterns to match
  response: string; // The static response in Romanian
  category: string; // Category for organization
  confidence: number; // Confidence level (0-1)
}

export interface StaticResponseService {
  getStaticResponse(normalizedQuestion: string): string | null;
  hasStaticResponse(normalizedQuestion: string): boolean;
  getAllCategories(): string[];
  getResponsesByCategory(category: string): StaticResponse[];
}

/**
 * Comprehensive Romanian cooking knowledge base
 * All patterns use normalized text (no diacritics, lowercase)
 */
const ROMANIAN_STATIC_RESPONSES: StaticResponse[] = [
  // === CONVERSII DE MĂSURARE ===
  {
    patterns: ['masura', 'masurare', 'cana', 'cani', 'lingura', 'lingurita', 'ml', 'litri'],
    response:
      'Conversii de măsurare:\n• 1 cană = 250ml\n• 1/2 cană = 125ml\n• 1/4 cană = 60ml\n• 1 lingură = 15ml\n• 1 linguriță = 5ml\n• 1/2 linguriță = 2.5ml',
    category: 'measuring',
    confidence: 0.95,
  },
  {
    patterns: ['greutate', 'kg', 'kilogram', 'grame', 'pound', 'lb', 'oz', 'uncie'],
    response:
      'Conversii de greutate:\n• 1 kg = 1000g\n• 1 pound (lb) = 454g\n• 1 uncie (oz) = 28g\n• 1 cană făină = ~125g\n• 1 cană zahăr = ~200g\n• 1 cană unt = ~225g',
    category: 'measuring',
    confidence: 0.95,
  },

  // === CONVERSII DE TEMPERATURĂ ===
  {
    patterns: ['celsius', 'fahrenheit', 'grade', 'temperatura', 'conversie temperatura'],
    response:
      'Conversii de temperatură:\n• °F = (°C × 9/5) + 32\n• °C = (°F - 32) × 5/9\n\nExemple:\n• 180°C = 356°F (cuptorul)\n• 200°C = 392°F\n• 220°C = 428°F',
    category: 'temperature',
    confidence: 0.95,
  },
  {
    patterns: ['cuptor', 'grade cuptor', 'temperatura cuptor'],
    response:
      'Temperature cuptor comune:\n• Scăzut: 140-170°C (284-338°F)\n• Mediu: 180-190°C (356-374°F)\n• Ridicat: 200-220°C (392-428°F)\n• Foarte ridicat: 230°C+ (446°F+)',
    category: 'temperature',
    confidence: 0.9,
  },

  // === SUBSTITUȚII COMUNE ===
  {
    patterns: ['inlocui ou', 'substitut ou', 'fara ou', 'ou substitute'],
    response:
      'Înlocuitori pentru 1 ou:\n• 1/4 cană piure de mere\n• 3 linguri aquafaba (zeama de năut)\n• 1 lingură semințe de in + 3 linguri apă\n• 1/4 cană iaurt\n• 1 lingură oțet + 1 linguriță bicarbonat',
    category: 'substitution',
    confidence: 0.95,
  },
  {
    patterns: ['inlocui unt', 'substitut unt', 'fara unt', 'unt substitute'],
    response:
      'Înlocuitori pentru unt:\n• Ulei (3/4 din cantitate)\n• Iaurt grecesc\n• Piure de avocado\n• Unt de cocos\n• Margarina\n• Piure de banane (pentru dulciuri)',
    category: 'substitution',
    confidence: 0.95,
  },
  {
    patterns: ['inlocui lapte', 'substitut lapte', 'fara lapte', 'lapte substitute'],
    response:
      'Înlocuitori pentru lapte:\n• Lapte de migdale\n• Lapte de ovăz\n• Lapte de cocos\n• Lapte de soia\n• Lapte de orez\n• Lapte de caju',
    category: 'substitution',
    confidence: 0.95,
  },
  {
    patterns: ['inlocui faina', 'substitut faina', 'fara faina', 'faina substitute'],
    response:
      'Înlocuitori pentru făină:\n• Făină de migdale (3/4 din cantitate)\n• Făină de cocos (1/4 din cantitate)\n• Făină de orez\n• Făină de ovăz\n• Făină de hrișcă\n• Făină de quinoa',
    category: 'substitution',
    confidence: 0.95,
  },
  {
    patterns: ['inlocui zahar', 'substitut zahar', 'fara zahar', 'zahar substitute'],
    response:
      'Înlocuitori pentru zahăr:\n• Miere (3/4 din cantitate)\n• Sirop de arțar (3/4 din cantitate)\n• Stevia (mult mai puțin!)\n• Zahăr de cocos\n• Sirop de agave\n• Purée de datlile',
    category: 'substitution',
    confidence: 0.95,
  },

  // === TEHNICI DE GĂTIT ===
  {
    patterns: ['blansare', 'blansat', 'cum blanchez'],
    response:
      'Blanșarea:\nFierbere scurtă (1-3 minute) urmată de răcire rapidă în apă cu gheață. Păstrează culoarea și textura legumelor, elimină gustul amar.',
    category: 'techniques',
    confidence: 0.9,
  },
  {
    patterns: ['sote', 'sotez', 'cum sotez'],
    response:
      'Sote:\nGătire rapidă la foc mare cu puțin ulei sau unt. Alimentele se mișcă constant în tigaie pentru gătire uniformă. Perfect pentru legume și carne.',
    category: 'techniques',
    confidence: 0.9,
  },
  {
    patterns: ['inabusire', 'inabusit', 'cum inabusesc'],
    response:
      'Înăbușire:\nGătire înceată în lichid (apă, vin, bulion) într-un vas acoperit. Prima dată se rumenește carnea, apoi se adaugă lichid și se gătește încet.',
    category: 'techniques',
    confidence: 0.9,
  },
  {
    patterns: ['caramelizare', 'caramelizez', 'cum caramelizez'],
    response:
      'Caramelizare:\nÎncălzirea zahărului până devine lichid și capătă culoare aurie. Pentru ceapă: gătire înceată până devine translucidă și dulce.',
    category: 'techniques',
    confidence: 0.9,
  },
  {
    patterns: ['marinar', 'marinare', 'cum marinhez'],
    response:
      'Marinare:\nLăsarea alimentelor în amestec de condimente, acid (oțet/lămâie) și ulei. Carnea: 2-24 ore în frigider. Peștele: 15-30 minute maximum.',
    category: 'techniques',
    confidence: 0.9,
  },
  {
    patterns: ['sous vide', 'sous-vide'],
    response:
      'Sous vide:\nMetodă de gătit în vid la temperatură joasă constantă. Alimentul se pune în pungă sigilată și se gătește în baia de apă cu temperatură precisă.',
    category: 'techniques',
    confidence: 0.9,
  },

  // === TIMPI DE GĂTIRE ===
  {
    patterns: ['oua fierte', 'cat timp ou', 'fierbere oua'],
    response:
      'Timpi fierbere ouă:\n• Moi: 4-5 minute\n• Medii: 7-8 minute\n• Tari: 10-12 minute\n\nÎncepem cronometrul când apa începe să clocotească.',
    category: 'timing',
    confidence: 0.95,
  },
  {
    patterns: ['orez', 'cat timp orez', 'fierbere orez'],
    response:
      'Gătirea orezului:\n• Raport: 1 parte orez la 2 părți apă\n• Timp: 15-20 minute\n• Metoda: fierbe 2 min, apoi foc mic acoperit\n• Se lasă să se odihnească 5 minute după gătire',
    category: 'timing',
    confidence: 0.95,
  },
  {
    patterns: ['paste', 'cat timp paste', 'fierbere paste'],
    response:
      'Gătirea pastelor:\n• Timp: 8-12 minute (verifica ambalajul)\n• Apă: 1 litru la 100g paste + sare\n• Al dente: mai ferme, se termină în sos\n• Testează prin gustare',
    category: 'timing',
    confidence: 0.95,
  },
  {
    patterns: ['cartofi', 'cat timp cartofi', 'fierbere cartofi'],
    response:
      'Gătirea cartofilor:\n• Fierți: 15-25 minute (depinde de mărime)\n• La cuptor: 45-60 minute la 200°C\n• Prăjiți: 3-5 minute în ulei fierbinte\n• Testează cu furculița',
    category: 'timing',
    confidence: 0.9,
  },
  {
    patterns: ['carne vita', 'vita', 'cat timp vita'],
    response:
      'Gătirea cărnii de vită:\n• Rare: 2-3 min/partea\n• Medium-rare: 3-4 min/partea\n• Medium: 4-5 min/partea\n• Well-done: 5-6 min/partea\nTemperaturi interne: 50°C rare, 60°C medium, 70°C+ well-done',
    category: 'timing',
    confidence: 0.9,
  },
  {
    patterns: ['pui', 'carne pui', 'cat timp pui'],
    response:
      'Gătirea cărnii de pui:\n• Piept: 6-8 min/partea\n• Pulpe: 8-10 min/partea\n• Întreg la cuptor: 20 min/500g la 190°C\n• Temperatura internă: minimum 75°C\n• Sucurile trebuie să fie transparente',
    category: 'timing',
    confidence: 0.9,
  },

  // === DEPOZITARE ===
  {
    patterns: ['pastreaza frigider', 'cat timp tine frigider', 'depozitare frigider'],
    response:
      'Depozitare în frigider:\n• Carne gătită: 3-4 zile\n• Pește gătit: 2-3 zile\n• Legume crude: 5-7 zile\n• Lactate: verifica data de expirare\n• Ouă: 3-5 săptămâni\n• Paste gătite: 3-5 zile',
    category: 'storage',
    confidence: 0.9,
  },
  {
    patterns: ['pastreaza congelator', 'cat timp tine congelator', 'inghetare'],
    response:
      'Depozitare în congelator:\n• Carne crudă: 3-6 luni\n• Pește: 2-3 luni\n• Legume: 8-12 luni\n• Pâine: 2-3 luni\n• Mâncare gătită: 2-3 luni\n• Înghețata: 2-4 luni',
    category: 'storage',
    confidence: 0.9,
  },
  {
    patterns: ['cat timp sta afara', 'temperatura camera', 'stat afara'],
    response:
      'La temperatura camerei:\n• Carne/pește: maxim 2 ore\n• Lactate: maxim 2 ore\n• Mâncare gătită: maxim 2 ore\n• Fructe: 2-7 zile (depinde de tip)\n• Pâine: 2-3 zile\nPeste 25°C, timpul se înjumătățește!',
    category: 'storage',
    confidence: 0.9,
  },

  // === USTENSILE DE BUCĂTĂRIE ===
  {
    patterns: ['cutit chef', 'cutit bucatar', 'cutite bucatarie'],
    response:
      'Cuțite de bucătărie:\n• Chef/bucătar: 20-25cm, universal\n• Paring: 8-10cm, pentru fructe/legume mici\n• Bread: zimțat, pentru pâine\n• Boning: subțire, pentru carne\n• Menține-le ascuțite pentru siguranță!',
    category: 'tools',
    confidence: 0.8,
  },
  {
    patterns: ['tigaie', 'tigai', 'ce tigaie'],
    response:
      'Tigăi pentru gătit:\n• Non-stick: pentru ouă, pește delicat\n• Inox: pentru rumenit, deglazing\n• Fontă: pentru fripturi, cuptor\n• Carbon steel: ca fontă dar mai ușoară\n• Wok: pentru stir-fry',
    category: 'tools',
    confidence: 0.8,
  },
  {
    patterns: ['oala', 'oale', 'ce oala'],
    response:
      'Oale pentru gătit:\n• Inox: universală, durabilă\n• Non-stick: pentru sosuri delicate\n• Fontă: pentru înăbușire, cuptor\n• Pressure cooker: pentru gătire rapidă\n• Stock pot: pentru supă, paste',
    category: 'tools',
    confidence: 0.8,
  },

  // === SFATURI GENERALE ===
  {
    patterns: ['sare cand', 'cand salez', 'sare inainte sau dupa'],
    response:
      'Când să sărezi:\n• Carnea: cu 1 oră înainte (extrage umiditatea)\n• Legumele: la final (să nu se înmoaie)\n• Apa pentru paste: când începe să clocotească\n• Sosurile: pe parcurs, gustă des',
    category: 'general',
    confidence: 0.8,
  },
  {
    patterns: ['ulei gatit', 'ce ulei', 'ulei pentru fritare'],
    response:
      'Uleiuri pentru gătit:\n• Măsline extra virgin: sosuri, salate\n• Măsline rafinate: gătire medie\n• Rapiță: universal, punct înalt de ardere\n• Floarea-soarelui: prăjire\n• Cocos: dulciuri, gătire asiatică',
    category: 'general',
    confidence: 0.8,
  },
  {
    patterns: ['gust amar', 'de ce amar', 'elimina amar'],
    response:
      'Eliminarea gustului amar:\n• Legume: blanșează în apă cu sare\n• Sosuri: adaugă puțin zahăr sau miere\n• Vinete: sărează și lasă 30 min, apoi clătește\n• Cafea: verifică măcinarea și timpul',
    category: 'general',
    confidence: 0.8,
  },

  // === NUTRIȚIE DE BAZĂ ===
  {
    patterns: ['calorii', 'kcal', 'valoare nutritiva'],
    response:
      'Valori calorice aproximative (per 100g):\n• Carne slabă: 150-200 kcal\n• Pește: 80-200 kcal\n• Orez/paste: 130-150 kcal\n• Legume: 20-50 kcal\n• Fructe: 40-80 kcal\nPentru informații precise, consultă etichetele!',
    category: 'nutrition',
    confidence: 0.7,
  },
];

/**
 * Implementation of static response service
 */
class StaticResponseServiceImpl implements StaticResponseService {
  private responses: StaticResponse[];
  private categoryMap: Map<string, StaticResponse[]>;

  constructor() {
    this.responses = ROMANIAN_STATIC_RESPONSES;
    this.categoryMap = this.buildCategoryMap();
  }

  /**
   * Build category mapping for fast lookups
   */
  private buildCategoryMap(): Map<string, StaticResponse[]> {
    const map = new Map<string, StaticResponse[]>();

    for (const response of this.responses) {
      if (!map.has(response.category)) {
        map.set(response.category, []);
      }
      map.get(response.category)!.push(response);
    }

    return map;
  }

  /**
   * Get static response for a normalized question
   * Performance target: <10ms
   */
  getStaticResponse(normalizedQuestion: string): string | null {
    if (!normalizedQuestion || typeof normalizedQuestion !== 'string') {
      return null;
    }

    const startTime = performance.now();

    try {
      // Convert to lowercase, remove diacritics, and clean up
      const cleanQuestion = this.removeDiacritics(normalizedQuestion.toLowerCase().trim());

      // Find best matching response
      let bestMatch: { response: StaticResponse; score: number } | null = null;

      for (const response of this.responses) {
        const score = this.calculateMatchScore(cleanQuestion, response);

        if (score > 0.7 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { response, score };
        }
      }

      if (bestMatch && bestMatch.score >= 0.8) {
        return bestMatch.response.response;
      }

      return null;
    } finally {
      const duration = performance.now() - startTime;

      // Log performance warning if lookup takes too long
      if (duration > 10) {
        console.warn(`Static response lookup took ${duration.toFixed(2)}ms, exceeding 10ms target`);
      }
    }
  }

  /**
   * Calculate match score between question and response patterns
   */
  private calculateMatchScore(question: string, response: StaticResponse): number {
    const questionWords = new Set(question.split(/\s+/).filter((word) => word.length > 1));
    let bestPatternScore = 0;

    for (const pattern of response.patterns) {
      const patternWords = pattern.split(/\s+/).filter((word) => word.length > 1);
      let patternScore = 0;

      // Check for exact pattern match (highest score)
      // Use word boundaries to ensure exact phrase matching
      const exactMatch =
        question === pattern ||
        question.includes(` ${pattern} `) ||
        question.startsWith(`${pattern} `) ||
        question.endsWith(` ${pattern}`);

      if (exactMatch) {
        patternScore = 1.0;
      } else {
        // Check for word-level matches
        let matchedWords = 0;
        for (const patternWord of patternWords) {
          // Direct match or partial match
          const hasMatch = Array.from(questionWords).some(
            (qWord) =>
              qWord === patternWord ||
              qWord.includes(patternWord) ||
              patternWord.includes(qWord) ||
              this.calculateWordSimilarity(qWord, patternWord) > 0.8
          );

          if (hasMatch) {
            matchedWords++;
          }
        }

        // Score based on percentage of pattern words matched
        patternScore = patternWords.length > 0 ? matchedWords / patternWords.length : 0;
      }

      bestPatternScore = Math.max(bestPatternScore, patternScore);
    }

    // Apply confidence factor
    return bestPatternScore * response.confidence;
  }

  /**
   * Calculate similarity between two words (simple Levenshtein-like)
   */
  private calculateWordSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    if (word1.length < 3 || word2.length < 3) return 0;

    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;

    if (longer.includes(shorter)) return 0.9;
    if (shorter.includes(longer.substring(0, shorter.length))) return 0.8;

    return 0;
  }

  /**
   * Romanian diacritics normalization map
   */
  private static readonly DIACRITICS_MAP: Record<string, string> = {
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

  /**
   * Remove Romanian diacritics from text
   */
  private removeDiacritics(text: string): string {
    return text.replace(
      /[ăâîșțĂÂÎȘȚ]/g,
      (char) => StaticResponseServiceImpl.DIACRITICS_MAP[char] || char
    );
  }

  /**
   * Check if there's a static response for the question
   */
  hasStaticResponse(normalizedQuestion: string): boolean {
    return this.getStaticResponse(normalizedQuestion) !== null;
  }

  /**
   * Get all available categories
   */
  getAllCategories(): string[] {
    return Array.from(this.categoryMap.keys()).sort();
  }

  /**
   * Get all responses for a specific category
   */
  getResponsesByCategory(category: string): StaticResponse[] {
    return this.categoryMap.get(category) || [];
  }
}

/**
 * Singleton instance
 */
let staticResponseServiceInstance: StaticResponseServiceImpl | null = null;

/**
 * Get the static response service instance
 */
export function getStaticResponseService(): StaticResponseService {
  if (!staticResponseServiceInstance) {
    staticResponseServiceInstance = new StaticResponseServiceImpl();
  }
  return staticResponseServiceInstance;
}

/**
 * Reset the static response service (useful for testing)
 */
export function resetStaticResponseService(): void {
  staticResponseServiceInstance = null;
}

/**
 * Check if a question can be answered with static responses
 * Uses simple normalization optimized for static responses
 */
export function canAnswerStatically(question: string): boolean {
  if (!question || typeof question !== 'string') {
    return false;
  }

  const service = getStaticResponseService();
  return service.hasStaticResponse(question);
}

/**
 * Get static response for a raw question (handles normalization internally)
 */
export function getStaticAnswer(question: string): string | null {
  if (!question || typeof question !== 'string') {
    return null;
  }

  const service = getStaticResponseService();
  return service.getStaticResponse(question);
}

/**
 * Get all static response categories with their responses
 * Useful for admin dashboard and analytics
 */
export function getAllStaticResponses(): Record<string, StaticResponse[]> {
  const service = getStaticResponseService();
  const categories = service.getAllCategories();
  const result: Record<string, StaticResponse[]> = {};

  for (const category of categories) {
    result[category] = service.getResponsesByCategory(category);
  }

  return result;
}

export default StaticResponseServiceImpl;
