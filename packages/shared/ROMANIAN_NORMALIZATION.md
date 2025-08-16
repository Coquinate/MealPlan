# Romanian Question Normalization Implementation

## Overview

Smart question normalization system that optimizes cache hit rates by grouping semantically similar Romanian questions. This implementation is part of the AI cache service and normalizes questions before MD5 hashing for cache keys.

## Features Implemented

### 1. Romanian Diacritic Handling

- Normalizes ă→a, â→a, î→i, ș→s, ț→t
- Handles both uppercase and lowercase diacritics
- Preserves semantic meaning while standardizing format

### 2. Pattern Categories with Priority System

Categories ordered by specificity (highest to lowest priority):

1. **Substitution** (priority: 1000+)
   - Patterns: `inlocui`, `schimba`, `schimb`, `in loc de`, `altceva`, `substitute`, `inlocuiesc`
   - Adds context for ingredient substitutions: `substitution_untul`

2. **Storage** (priority: 600+)
   - Patterns: `cat timp tine`, `pastrez`, `conserv`, `depozitez`, `pastreaza`
   - Handles duration vs storage conflicts

3. **Duration** (priority: 500+)
   - Patterns: `cat timp`, `cat dureaza`, `in cat timp`, `cat ia`, `durata`, `minute`, `ore`

4. **Calories** (priority: 400+)
   - Patterns: `calorii`, `kcal`, `grasimi`, `nutritie`, `cate calorii`

5. **Servings** (priority: 400+)
   - Patterns: `persoane`, `portii`, `serviri`, `pentru cati`, `cate persoane`

6. **Difficulty** (priority: 400+)
   - Patterns: `greu`, `usor`, `dificil`, `simplu`, `cat de greu`

7. **Temperature** (priority: 400+)
   - Patterns: `grade`, `temperatura`, `celsius`, `fahrenheit`, `cat de cald`

8. **Techniques** (priority: 300+)
   - Patterns: `cum sa`, `cum fac`, `cum prepar`, `cum gatesc`, `metoda`, `procesul`

9. **Time of Day** (priority: 300+)
   - Patterns: `pranz`, `cina`, `mic dejun`, `gustare`, `micul dejun`

10. **Ingredients** (priority: 100+)
    - Patterns: `cu ce fac`, `ce ingredient`, `ingrediente`, `ce pun`

### 3. Advanced Matching Algorithm

- **Multi-pattern detection**: Finds all matching patterns in a question
- **Priority-based selection**: Uses priority + pattern length for best match
- **Context extraction**: Adds relevant context for substitution questions
- **Common word filtering**: Excludes common Romanian words from context

### 4. Performance Optimizations

- **Target: <5ms** per normalization
- Performance monitoring with warnings
- Efficient pattern matching with early termination
- Optimized regex operations

### 5. Romanian Language Support

- **Word stemming**: Basic Romanian suffix removal
- **Common words filtering**: 60+ common Romanian words excluded from context
- **Verb form variations**: Multiple forms (schimb/schimba, gatesc/gatisc)

## Usage Examples

```typescript
import { normalizeRomanianQuestion } from '@coquinate/shared';

// Basic usage
const normalized = normalizeRomanianQuestion('Cât timp durează rețeta?');
// Result: 'duration'

// With context extraction
const withContext = normalizeRomanianQuestion('Cu ce pot înlocui untul?');
// Result: 'substitution_untul'

// Cache integration
const cacheService = getAICacheService();
const cacheKey = cacheService.generateCacheKey('recipe123', 'Cât timp durează?');
// Uses normalized question internally
```

## Test Coverage

- 26 comprehensive tests covering all pattern categories
- Romanian diacritic handling tests
- Performance requirement validation (<5ms)
- Cache key consistency verification
- Edge case handling (empty strings, special characters)
- Pattern priority conflict resolution

## Integration Points

1. **AI Cache Service**: Automatic normalization before MD5 hashing
2. **Standalone Function**: `normalizeRomanianQuestion()` for external use
3. **Cache Key Generation**: Integrated into `generateCacheKey()` method
4. **Performance Monitoring**: Built-in timing and warnings

## Benefits

- **Improved Cache Hit Rates**: Similar questions share cache entries
- **Romanian Language Optimized**: Native diacritic and grammar support
- **Performance Focused**: Sub-5ms normalization target
- **Extensible**: Easy to add new patterns and categories
- **Type Safe**: Full TypeScript support with no `any` types

## Files Modified

- `/packages/shared/src/utils/ai-cache-service.ts` - Main implementation
- `/packages/shared/src/utils/ai-cache-service.test.ts` - Comprehensive tests
