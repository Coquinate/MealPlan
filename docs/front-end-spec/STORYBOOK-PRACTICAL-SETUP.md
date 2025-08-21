# 🚀 Storybook Setup Practic pentru Coquinate

## Prezentare Generală

### De ce Storybook pentru tine?
- **2 apps** (web + admin) = componente shared
- **Lucrezi cu AI** = stories sunt exemple clare pentru AI
- **Mock everything** = nu aștepți backend-ul
- **Teste vizuale instant** = vezi 10 variante în 10 secunde

### Beneficii ROI pentru Coquinate

| Fără Storybook | Cu Storybook |
|---|---|
| 3 HTML files pentru coming soon | 1 component, 10 variante instant |
| Copy-paste între web și admin | Import from '@coquinate/ui' |
| "Cum arăta butonul ăla?" | http://localhost:6006 → Components → Button |
| Refaci tot pentru dark mode | Toggle dark mode button |
| Explici la AI ce vrei | AI vede stories, înțelege singur |

---

## 🎯 FAZA 1: Setup și Configurare de Bază (30 minute)

### Obiectivul Fazei 1
Setează infrastructura de bază Storybook în packages/ui cu toate dependințele și configurațiile esențiale pentru funcționarea stabilă în monorepo.

### 1.1 Instalare Inițială
```bash
# Din root
cd packages/ui
pnpm dlx storybook@latest init --builder=vite
pnpm add -D @storybook/addon-themes @storybook/addon-a11y msw msw-storybook-addon vite-tsconfig-paths @storybook/test vite-plugin-svgr @testing-library/jest-dom
```

### 1.2 Configurare Core
```typescript
// packages/ui/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    'msw-storybook-addon',
  ],
  framework: '@storybook/react-vite',
  typescript: { 
    reactDocgen: 'react-docgen-typescript' // Fix pentru React 19/TS
  },
  staticDirs: ['../public'], // Assets pentru stories
  viteFinal: (config) => {
    // Auto-aliases din tsconfig (zero drift)
    config.plugins = [...(config.plugins ?? []), tsconfigPaths(), svgr()];
    return config;
  },
};

export default config;
```

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src",
    "paths": { "@/*": ["*"] }
  },
  "include": ["src/**/*", ".storybook/**/*"]
}
```

```tsx
// packages/ui/.storybook/preview.tsx
import '../src/styles/globals.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { ThemeProvider } from '@/providers/theme';
import { IntlProvider } from 'react-intl';

// MSW cu silence pentru ne-mock-uite
initialize({ onUnhandledRequest: 'bypass' });

export const parameters = {
  backgrounds: {
    default: 'eggshell',
    values: [
      { name: 'eggshell', value: 'oklch(98% 0.004 75)' },
      { name: 'dark', value: 'oklch(15% 0.01 200)' },
    ],
  },
  a11y: {
    element: '#storybook-root',
    config: {},
    options: {},
    manual: false,
  },
};

// Providers globali (evită boilerplate în stories)
export const decorators = [
  mswDecorator,
  (Story) => (
    <IntlProvider locale="ro" messages={{}}>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </IntlProvider>
  ),
];
```

```typescript
// packages/ui/.storybook/test-runner.ts
import { expect } from '@storybook/test';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect cu jest-dom matchers
expect.extend(matchers);
```

### 1.3 Configurare TypeScript și Package.json
```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src",
    "paths": { "@/*": ["*"] }
  },
  "include": ["src/**/*", ".storybook/**/*"]
}
```

```json
// packages/ui/package.json
{
  "name": "@coquinate/ui",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "tsup",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:sb": "storybook test --config-dir .storybook"
  }
}
```

```typescript
// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  external: ['react', 'react-dom'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
});
```

### 1.4 Verificare Setup
```bash
# Test că totul funcționează
pnpm --filter @coquinate/ui storybook
# Ar trebui să se deschidă http://localhost:6006
```

---

## 🎯 FAZA 2: Primul Component și Story (20 minute)

### Obiectivul Fazei 2
Creează primul component functional (Button) cu story complet pentru a valida că întregul setup funcționează corect și pentru a stabili pattern-ul pentru componente viitoare.

### 2.1 Component de Bază
```tsx
// packages/ui/src/components/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary-warm text-white hover:bg-primary-dark',
    ghost: 'border border-primary-warm text-primary-warm hover:bg-primary-warm/10',
    coral: 'bg-accent-coral text-white hover:bg-accent-coral-deep',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded-lg transition-all`}
    >
      {children}
    </button>
  );
};
```

```tsx
// packages/ui/src/components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],  // Auto-generează docs din props
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'coral'],
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories simple - AI înțelege instant ce face fiecare
export const Primary: Story = {
  args: { children: 'Click me', variant: 'primary' },
};

export const Ghost: Story = {
  args: { children: 'Ghost button', variant: 'ghost' },
};

export const Coral: Story = {
  args: { children: 'Accent button', variant: 'coral' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

### 2.2 Export pentru Apps
```typescript
// packages/ui/src/index.ts
export { Button } from './components/Button';
// PLOP_INJECT_EXPORT

export type { ButtonProps } from './components/Button';
```

```tsx
// apps/web/src/app/page.tsx (Next 15 + React 19)
import { Button } from '@coquinate/ui';

export default function Home() {
  return <Button variant="coral">Get Started</Button>;
}
```

### 2.3 Verificare Component
```bash
# 1. Check în Storybook că toate stories funcționează
# 2. Verifică că Controls schimbă variant/size
# 3. Test import în apps/web
```

---

## 🎯 FAZA 3: MSW Mocking și Page Stories (25 minute)

### Obiectivul Fazei 3
Implementează MSW pentru API mocking și creează story-uri pentru componente complexe care interacționează cu API-uri, stabilind pattern-ul pentru testarea flow-urilor complete.

### 3.1 Page Story cu MSW Mocking
```tsx
// packages/ui/src/pages/EmailCapture.stories.tsx
import { EmailCapture } from '@/components/EmailCapture';
import { userEvent, within, expect } from '@storybook/test';
import { rest } from 'msw';

export default {
  title: 'Pages/EmailCapture',
  component: EmailCapture,
};

// Mock API response cu MSW (mai aproape de realitate)
export const Default = {
  parameters: {
    msw: {
      handlers: [
        rest.post('/api/subscribe', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ success: true }), ctx.delay(500))
        ),
      ],
    },
  },
};

// Test interaction
export const WithUserFlow = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // User types email
    const input = canvas.getByPlaceholderText(/email/i);
    await userEvent.type(input, 'test@example.com');
    
    // User clicks submit
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    
    // Check success state
    await expect(button).toHaveTextContent('✓ Înregistrat');
  },
};

// Loading state
export const Loading = {
  parameters: {
    msw: {
      handlers: [
        rest.post('/api/subscribe', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ success: true }), ctx.delay(3000))
        ),
      ],
    },
  },
};

// Error state  
export const Error = {
  parameters: {
    msw: {
      handlers: [
        rest.post('/api/subscribe', (_req, res, ctx) =>
          res(ctx.status(500), ctx.json({ error: 'Server error' }))
        ),
      ],
    },
  },
};
```

### 3.2 Verificare MSW Integration
```bash
# 1. Storybook → EmailCapture → Default story
# 2. Verifică că API call-ul e interceptat 
# 3. Test Loading/Error states funcționează
# 4. Play function execută user flow automat
```

### 3.3 Structure Finală
```
packages/ui/
├── .storybook/
│   ├── main.ts          # Config
│   └── preview.tsx      # Global styles & params
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   ├── EmailCapture.tsx
│   │   └── EmailCapture.stories.tsx
│   ├── pages/           # Full page stories
│   │   └── ComingSoon.stories.tsx
│   └── styles/
│       └── globals.css  # Tailwind + OKLCH
└── package.json
```

---

## 🎯 FAZA 4: Workflow cu AI și Commands (15 minute)

### Obiectivul Fazei 4
Stabilește workflow-ul optim pentru colaborarea cu AI în dezvoltarea componentelor și configurează comenzile de lucru eficiente.
```json
// packages/ui/package.json
{
  "name": "@coquinate/ui",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "tsup",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:sb": "storybook test --config-dir .storybook"
  }
}
```

```typescript
// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  external: ['react', 'react-dom'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
});
```

### 7. Export pentru apps
```typescript
// packages/ui/src/index.ts
export { Button } from './components/Button';
export { EmailCapture } from './components/EmailCapture';
export { MealCard } from './components/MealCard';
```

```tsx
// apps/web/src/app/page.tsx (Next 15 + React 19)
import { Button, EmailCapture } from '@coquinate/ui';

export default function Home() {
  return (
    <>
      <EmailCapture />
      <Button variant="coral">Get Started</Button>
    </>
  );
}
```

### 4.1 Workflow cu AI (tu + mine)

#### Pasul 1: Ceri componentă nouă
```
"Fă-mi un MealCard component cu imagine, titlu, timp, porții"
```

#### Pasul 2: AI generez component + story
```tsx
// MealCard.tsx - componenta
// MealCard.stories.tsx - toate variantele
```

#### Pasul 3: Tu verifici în Storybook
```bash
pnpm --filter @coquinate/ui dev
# http://localhost:6006
# Vezi toate variantele, modifici cu Controls
```

#### Pasul 4: Folosești în app
```tsx
import { MealCard } from '@coquinate/ui';
// Gata, funcționează
```

### 4.2 Commands Esențiale

```bash
# Development
pnpm --filter @coquinate/ui storybook   # Start Storybook

# Build  
pnpm --filter @coquinate/ui build       # Build components (cu tsup)
pnpm --filter @coquinate/ui build-storybook  # Build static Storybook

# Use in apps
pnpm --filter @coquinate/web dev        # Web app cu components din UI
pnpm --filter @coquinate/admin dev      # Admin cu același components
```

---

## 🎯 FAZA 5: Tips și Best Practices (10 minute)

### Obiectivul Fazei 5
Implementează best practices pentru dezvoltarea eficientă cu Storybook și maximizarea colaborării cu AI.

### 5.1 Stories = Documentation pentru AI
```tsx
// În loc să explici: "butonul poate fi primary sau ghost"
// AI vede direct stories și înțelege
export const Primary = { args: { variant: 'primary' } };
export const Ghost = { args: { variant: 'ghost' } };
```

### 5.2 Mock Everything cu MSW
```tsx
// Nu aștepta backend - MSW e mai realistic
parameters: {
  msw: {
    handlers: [
      rest.get('/api/meals', (_req, res, ctx) => 
        res(ctx.json(mockMeals))
      ),
      rest.get('/api/user', (_req, res, ctx) => 
        res(ctx.json(mockUser))
      ),
    ],
  },
}
```

### 5.3 Test Flows, Nu Doar Components
```tsx
// Full user journey
export const UserSignupFlow = {
  play: async ({ canvasElement }) => {
    // 1. Fill form
    // 2. Submit
    // 3. Check success
    // 4. Redirect
  },
};
```

---

## 🎯 FAZA 6: Stack-Specific Configuration (15 minute)

### Obiectivul Fazei 6
Configurează Storybook pentru funcționarea optimă cu stack-ul specific Coquinate: React 19, Next 15 RSC, Tailwind v4 + OKLCH, și monorepo cu pnpm.

### 6.1 React 19 + Next 15 RSC
- Storybook rulează **client-only** - extrage UI în componente client
- Nu pune direct RSC pages în Storybook
- Fă wrapper components pentru RSC parts

### 6.2 Tailwind v4 + OKLCH
- Import `globals.css` în preview.tsx ✅
- Scanează și `.storybook/**/*` pentru clase:
```javascript
// tailwind.config.js
export default {
  content: [
    './packages/ui/src/**/*.{ts,tsx,mdx}',
    './packages/ui/.storybook/**/*.{ts,tsx,mdx}',
    './packages/ui/**/*.mdx', // Pentru Docs/MDX pages
  ],
  /* OKLCH tokens */
}
```

### 6.3 Monorepo cu pnpm
- `vite-tsconfig-paths` = zero drift pentru aliases
- `peerDependencies` = evită React duplicates
- `sideEffects: false` = tree-shaking mai bun

### 6.4 Un Singur React în Workspace
```json
// La root - package.json sau pnpm-workspace.yaml
{
  "pnpm": {
    "overrides": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    }
  }
}
```

---

## 🎯 FAZA 7: Quality of Life Upgrades (25 minute)

### Obiectivul Fazei 7
Adaugă funcționalități avansate pentru îmbunătățirea productivității: design tokens page, generator automat de componente, și RSC wrapper pattern.

### 7.1 Design Tokens Page (pentru AI + oameni)
```mdx
// packages/ui/.storybook/DesignTokens.mdx
import { Meta, ColorPalette, ColorItem } from '@storybook/blocks';

<Meta title="Design/Tokens" />

# Design Tokens

## OKLCH Colors
<ColorPalette>
  <ColorItem title="Primary Warm" subtitle="oklch(58% 0.08 200)" colors={{ primary: 'oklch(58% 0.08 200)' }} />
  <ColorItem title="Accent Coral" subtitle="oklch(70% 0.18 20)" colors={{ coral: 'oklch(70% 0.18 20)' }} />
  <ColorItem title="Eggshell" subtitle="oklch(98% 0.004 75)" colors={{ bg: 'oklch(98% 0.004 75)' }} />
</ColorPalette>
```

### 7.2 Generator (Plop/CLI)
```bash
# Auto-generează Component.tsx + .stories.tsx + .test.tsx
pnpm add -D plop
```

### 7.3 RSC Wrapper Pattern
```tsx
// Pentru Next 15 RSC pages în Storybook
'use client';
import { MealPlanPage } from '@/app/meal-plan/page';

export const MealPlanPageWrapper = () => <MealPlanPage />;
```

### 7.4 CSS Export (Optional)
```typescript
// packages/ui/src/index.ts
export * from './components';
// export { default as styles } from './styles/globals.css'; // doar dacă apps vor să importe direct
```

---

## 🎯 FAZA 8: Testing și CI Setup (10 minute)

### Obiectivul Fazei 8
Configurează testarea automată și integrarea cu CI pentru validarea componentelor și a story-urilor.

### 8.1 CI Pipeline Setup
```bash
# În pipeline
pnpm --filter @coquinate/ui build-storybook
pnpm --filter @coquinate/ui test:sb
# A11y checks + interaction tests automat ✅
```

### 8.2 Smoke Test (5 pași)
```bash
# 1. Setup
pnpm i && pnpm --filter @coquinate/ui storybook

# 2. ✅ Controls schimbă variant/size la Button
# 3. ✅ Theme toggle (dark/light) funcționează  
# 4. ✅ EmailCapture → MSW interceptează Default/Loading/Error
# 5. ✅ Test runner: pnpm --filter @coquinate/ui test:sb
```

---

## 🎯 FAZA 9: Troubleshooting și Finalizare (10 minute)

### Obiectivul Fazei 9
Rezolvă problemele comune și finalizează setup-ul pentru utilizare în producție.

### 9.1 Troubleshooting Rapid

| Problemă | Soluție |
|---|---|
| Clasă Tailwind nu apare | Verifică globs în `tailwind.config.js` (ai `src`, `.storybook`, `**/*.mdx` ✔) |
| "Invalid hook call / două React-uri" | `peerDependencies` + `pnpm overrides` (vezi mai sus) |
| MSW nu interceptează | `initialize({ onUnhandledRequest: 'bypass' })` + `parameters.msw.handlers` pe URL exact |
| SVG ca componentă nu merge | `vite-plugin-svgr` în `viteFinal` ✔ |

### 9.2 Quick Start (5 minute)
```bash
# 1. Setup cu Vite + toate extensiile
cd packages/ui
pnpm dlx storybook@latest init --builder=vite
pnpm add -D @storybook/addon-themes msw msw-storybook-addon vite-tsconfig-paths @storybook/test vite-plugin-svgr

# 2. Copy config-urile de mai sus
# main.ts + preview.tsx + tsconfig.json + package.json

# 3. Start
pnpm storybook

# 4. See it
# http://localhost:6006
```

---

## ✅ Checklist Final Implementation

### Core Setup
- ✅ **Zero drift**: `vite-tsconfig-paths` pentru aliases
- ✅ **React 19 ready**: `reactDocgen` + `peerDependencies`  
- ✅ **MSW realistic**: `onUnhandledRequest: 'bypass'`
- ✅ **Providers globali**: Theme + i18n în decorators
- ✅ **SVG support**: `vite-plugin-svgr`
- ✅ **Test interactions**: `@storybook/test` + `jest-dom`

### Production Optimizations  
- ✅ **Clean publishes**: `"files": ["dist"]`
- ✅ **Tree-shaking**: `sideEffects: false` + `treeshake: true`
- ✅ **Minified builds**: conditional minify în tsup
- ✅ **Sourcemaps**: pentru debugging în production
- ✅ **A11y checks**: `@storybook/addon-a11y` automat

### Quality & Scaling
- ✅ **Tailwind coverage**: Include `.storybook/**/*` + `**/*.mdx`
- ✅ **Assets support**: `staticDirs` pentru imagini
- ✅ **CI-ready tests**: `test:sb` cu proper config-dir
- ✅ **Design tokens**: MDX page pentru AI + oameni

---

## 🎯 APPENDIX: Generator Automat (Bonus - 20 minute)

### Obiectivul Appendix
Implementează generator automat pentru componente noi cu Plop, pentru accelerarea dezvoltării.

### Setup Generator
```bash
# Auto-generează Component + Story + Test
pnpm add -D plop
```

```javascript
// packages/ui/plopfile.js
export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generează Component + Story + Test',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Numele componentei (ex: MealCard):',
        validate: (value) => {
          if (!value) return 'Numele e obligatoriu';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) return 'PascalCase required (ex: MealCard)';
          return true;
        },
      },
      {
        type: 'input', 
        name: 'description',
        message: 'Descrierea componentei:',
        default: 'A reusable UI component',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Tipul componentei:',
        choices: ['atom', 'molecule', 'organism'],
        default: 'molecule',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{name}}.tsx',
        templateFile: 'templates/Component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{name}}.stories.tsx',
        templateFile: 'templates/Component.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{name}}.test.tsx',
        templateFile: 'templates/Component.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/index.ts',
        templateFile: 'templates/index.ts.hbs',
      },
      {
        type: 'modify',
        path: 'src/index.ts',
        pattern: '// PLOP_INJECT_EXPORT',
        template: "export { {{name}} } from './components/{{kebabCase name}}';\n// PLOP_INJECT_EXPORT",
      },
    ],
  });
}
```

```handlebars
{{!-- packages/ui/templates/Component.tsx.hbs --}}
import React from 'react';

export interface {{name}}Props {
  /**
   * {{description}}
   */
  variant?: 'primary' | 'secondary';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Component children
   */
  children?: React.ReactNode;
}

/**
 * {{description}}
 */
export const {{name}} = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: {{name}}Props) => {
  const variants = {
    primary: 'bg-primary-warm text-white hover:bg-primary-dark',
    secondary: 'bg-surface-white border border-primary-warm text-primary-warm hover:bg-primary-warm/10',
  };

  return (
    <div
      className={`${variants[variant]} rounded-lg p-4 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
```

```handlebars
{{!-- packages/ui/templates/Component.stories.tsx.hbs --}}
import type { Meta, StoryObj } from '@storybook/react';
import { {{name}} } from './{{name}}';

const meta = {
  title: '{{titleCase type}}s/{{name}}',
  component: {{name}},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{description}}',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof {{name}}>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary variant cu styling default
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '{{name}} Content',
  },
};

/**
 * Secondary variant cu border styling
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: '{{name}} Content',
  },
};

/**
 * Custom styling cu className
 */
export const CustomStyling: Story = {
  args: {
    variant: 'primary',
    className: 'shadow-lg border-2 border-accent-coral',
    children: 'Custom {{name}}',
  },
};

/**
 * Toate variantele side-by-side
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <{{name}} variant="primary">Primary</{{name}}>
      <{{name}} variant="secondary">Secondary</{{name}}>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparație între toate variantele disponibile',
      },
    },
  },
};
```

```handlebars
{{!-- packages/ui/templates/Component.test.tsx.hbs --}}
import { render, screen } from '@testing-library/react';
import { {{name}} } from './{{name}}';

describe('{{name}}', () => {
  it('renders children correctly', () => {
    render(<{{name}}>Test Content</{{name}}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<{{name}}>Test</{{name}}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('bg-primary-warm');
  });

  it('applies secondary variant styles when specified', () => {
    render(<{{name}} variant="secondary">Test</{{name}}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('bg-surface-white', 'border-primary-warm');
  });

  it('applies custom className', () => {
    render(<{{name}} className="custom-class">Test</{{name}}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    render(<{{name}} data-testid="test-component">Test</{{name}}>);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
```

```handlebars
{{!-- packages/ui/templates/index.ts.hbs --}}
export { {{name}} } from './{{name}}';
export type { {{name}}Props } from './{{name}}';
```

```typescript
// packages/ui/src/index.ts - modifică să incluzi:
export { Button } from './components/button';
export { EmailCapture } from './components/email-capture';
// PLOP_INJECT_EXPORT

export type { ButtonProps } from './components/button';
export type { EmailCaptureProps } from './components/email-capture';
```

```json
// packages/ui/package.json - adaugă în scripts:
{
  "scripts": {
    "generate": "plop",
    "g": "plop"
  }
}
```

### Cum să folosești generatorul:

```bash
# Generează o componentă nouă
pnpm --filter @coquinate/ui generate
# sau scurt:
pnpm --filter @coquinate/ui g

# Răspunde la întrebări:
# ? Numele componentei: MealCard
# ? Descrierea: A card component for displaying meal information  
# ? Tipul: molecule

# Generează automat:
# ✓ src/components/meal-card/MealCard.tsx
# ✓ src/components/meal-card/MealCard.stories.tsx  
# ✓ src/components/meal-card/MealCard.test.tsx
# ✓ src/components/meal-card/index.ts
# ✓ Updates src/index.ts cu export
```

### Composition (Advanced)
```bash
# UI Storybook standalone
pnpm --filter @coquinate/ui build-storybook

# Apps reference UI build în refs
# → Hub unificat: web + admin + ui components
```

---

---

## 📋 Sumar Implementare

### Fazele Complete (Total: ~150 minute)

1. **FAZA 1**: Setup și Configurare de Bază (30 min) - Instalare, config core, TypeScript
2. **FAZA 2**: Primul Component și Story (20 min) - Button component cu toate variantele
3. **FAZA 3**: MSW Mocking și Page Stories (25 min) - EmailCapture cu API mocking
4. **FAZA 4**: Workflow cu AI și Commands (15 min) - Stabilire workflow și comenzi
5. **FAZA 5**: Tips și Best Practices (10 min) - Patterns pentru eficiență maximă
6. **FAZA 6**: Stack-Specific Configuration (15 min) - React 19, Next 15, Tailwind v4
7. **FAZA 7**: Quality of Life Upgrades (25 min) - Design tokens, generator, wrapper patterns
8. **FAZA 8**: Testing și CI Setup (10 min) - Automatizare și validare
9. **FAZA 9**: Troubleshooting și Finalizare (10 min) - Rezolvare probleme comune

**APPENDIX**: Generator Automat (Bonus - 20 min) - Plop generator pentru componente

### Rezultat Final
**Setup 100% production-ready pentru monorepo cu AI + design system.**

**Ready to ship! 🚀✨**

---

*Documentul a fost organizat în faze logice de implementare pentru facilitarea execuției pas-cu-pas în platforma de meal planning românească Coquinate.*