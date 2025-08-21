# Convenții de Cod și Stil

## TypeScript
- **Versiune**: 5.9.x cu strict mode activat
- **Target**: ES2022
- **Module**: ESNext
- **Toate fișierele** trebuie să aibă tipuri explicite
- Folosește type-safe patterns din `@coquinate/shared`

## Convenții de Denumire
- **Componente**: PascalCase (ex: `MealPlanner.tsx`)
- **Utilități**: kebab-case (ex: `ai-service.ts`)
- **Teste**: Același nume cu sufix `.test.ts`
- **Stiluri**: kebab-case pentru CSS modules

## Structura Import-urilor
```typescript
// 1. External packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Internal packages (monorepo)
import { Button } from '@coquinate/ui';
import { aiService } from '@coquinate/shared';

// 3. Local imports
import { localUtil } from '@/utils/helper';
```

## Pattern-uri Arhitecturale Critice

### Coordination Hooks Pattern (IMPORTANT)
Componentele NU accesează direct Zustand/tRPC/Realtime. Folosește coordination hooks:
```typescript
// BUN - Folosește coordination hooks
const { meals, isLoading, updateMeal } = useMealPlanSync()

// RĂU - Acces direct la state
const store = useMealPlanStore()
```

### AI Integration Pattern
```typescript
// Folosește ÎNTOTDEAUNA @ai-sdk/google, NU @google/generative-ai
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

const aiModel = google('gemini-2.0-flash', {
  apiKey: process.env.GEMINI_API_KEY
});
```

### i18n Pattern
```typescript
// NU hardcoda stringuri
// RĂU: <button>Submit</button>
// BUN: <button>{t('common:submit')}</button>

import { useTranslation } from 'react-i18next';
const { t } = useTranslation(['common', 'auth']);
```

### Error Boundaries
Fiecare secțiune majoră trebuie să aibă error boundaries:
```typescript
import { RootErrorBoundary } from '@/components/error-boundaries';
// Wrap components in error boundaries for resilience
```

## Stilizare (Tailwind CSS)

### Design Tokens Obligatorii
- Folosește culori OKLCH: `primary: 'oklch(62% 0.05 250)'`
- Touch targets minimum 44px
- NU folosi valori arbitrare Tailwind (enforced by ESLint)
- Folosește design tokens din `@coquinate/config`

### Class Merging
```typescript
import { cn } from '@coquinate/shared/utils';

className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // prop override
)}
```

## Componente

### Dezvoltare cu Storybook
- Toate componentele partajate dezvoltate în `packages/ui`
- Stories ca documentație - AI înțelege componentele prin stories
- Mock API calls cu MSW pentru testare realistă
- Urmează 9-Phase Implementation din docs

### Component Standards
- Folosește CVA pentru variante type-safe
- Implementează error boundaries pentru features majore
- Adaugă i18n keys pentru TOT textul user-facing

## Testare

### Strategii de Testare
- Unit tests cu Vitest pentru utilități și hooks
- Component tests cu React Testing Library
- E2E tests cu Playwright pentru flow-uri critice
- ÎNTOTDEAUNA verifică afișarea corectă a limbii române

### Convenții Test
```typescript
describe('ComponentName', () => {
  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## Git Workflow
- Commit messages format conventional (feat:, fix:, chore:, etc.)
- Pre-commit hooks rulează linting și formatting automat
- Referențiere task-uri în commits: `feat: implement JWT auth (task 1.2)`

## Securitate
- NICIODATĂ nu comite secrets sau API keys
- Folosește variabile de mediu pentru configurare sensibilă
- Urmează best practices de securitate în cod
- Nu expune sau logheze secrets în cod