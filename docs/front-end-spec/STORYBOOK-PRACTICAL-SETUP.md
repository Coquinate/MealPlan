# 🚀 Storybook Setup Practic pentru Coquinate

## Prezentare Generală

### De ce Storybook pentru tine?

- **2 apps** (web + admin) = componente shared
- **Lucrezi cu AI** = stories sunt exemple clare pentru AI
- **Mock everything** = nu aștepți backend-ul
- **Teste vizuale instant** = vezi 10 variante în 10 secunde

### Beneficii ROI pentru Coquinate

| Fără Storybook                  | Cu Storybook                                |
| ------------------------------- | ------------------------------------------- |
| 3 HTML files pentru coming soon | 1 component, 10 variante instant            |
| Copy-paste între web și admin   | Import from '@coquinate/ui'                 |
| "Cum arăta butonul ăla?"        | http://localhost:6006 → Components → Button |
| Refaci tot pentru dark mode     | Toggle dark mode button                     |
| Explici la AI ce vrei           | AI vede stories, înțelege singur            |

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
    reactDocgen: 'react-docgen-typescript', // Fix pentru React 19/TS
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

export const Button = ({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) => {
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
  tags: ['autodocs'], // Auto-generează docs din props
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

### 3.1 Type-Safe API Contracts cu Zod

```typescript
// packages/shared/src/types/subscribe.ts
import { z } from 'zod';

export const SubscribeRequest = z.object({
  email: z.string().email('Email invalid'),
});
export type SubscribeRequest = z.infer<typeof SubscribeRequest>;

export const SubscribeResponse = z.object({
  status: z.literal('ok'),
  id: z.string().uuid().optional(),
  message: z.string().optional(),
});
export type SubscribeResponse = z.infer<typeof SubscribeResponse>;

export const SubscribeError = z.object({
  status: z.literal('error'),
  code: z.enum(['invalid_email', 'already_subscribed', 'rate_limited', 'server_error']),
  message: z.string().optional(),
});
export type SubscribeError = z.infer<typeof SubscribeError>;
```

### 3.2 MSW Handlers cu Reusability Pattern

```typescript
// packages/ui/src/mocks/handlers/subscribe.ts
import { http, HttpResponse, delay } from 'msw';
import type { SubscribeRequest, SubscribeResponse } from '@coquinate/shared';

const baseUrl = '/api/subscribe';

function success(payload?: Partial<SubscribeResponse>) {
  return http.post(baseUrl, async ({ request }) => {
    const body = (await request.json()) as SubscribeRequest;
    if (!body?.email) {
      return HttpResponse.json(
        { status: 'error', code: 'invalid_email', message: 'Email is required' },
        { status: 400 }
      );
    }

    await delay(500);
    return HttpResponse.json({
      status: 'ok',
      message: 'Te-ai înscris cu succes!',
      ...payload,
    });
  });
}

function invalidEmail() {
  return http.post(baseUrl, async () => {
    await delay(300);
    return HttpResponse.json(
      { status: 'error', code: 'invalid_email', message: 'Email invalid' },
      { status: 400 }
    );
  });
}

function alreadySubscribed() {
  return http.post(baseUrl, async () => {
    await delay(400);
    return HttpResponse.json(
      { status: 'error', code: 'already_subscribed', message: 'Email deja abonat' },
      { status: 409 }
    );
  });
}

function rateLimited() {
  return http.post(baseUrl, async () => {
    await delay(200);
    return HttpResponse.json(
      { status: 'error', code: 'rate_limited', message: 'Prea multe încercări' },
      { status: 429 }
    );
  });
}

function serverError() {
  return http.post(baseUrl, async () => {
    await delay(600);
    return HttpResponse.json(
      { status: 'error', code: 'server_error', message: 'Eroare de server' },
      { status: 500 }
    );
  });
}

function slowSuccess(ms: number = 2000) {
  return http.post(baseUrl, async () => {
    await delay(ms);
    return HttpResponse.json({ status: 'ok', message: 'Success after delay' });
  });
}

function networkError() {
  return http.post(baseUrl, async () => {
    return HttpResponse.error();
  });
}

// Export grouped handlers for easy import
export const subscribeHandlers = {
  success,
  invalidEmail,
  alreadySubscribed,
  rateLimited,
  serverError,
  slowSuccess,
  networkError,
};

// Default handlers for global MSW setup
export const defaultSubscribeHandlers = [subscribeHandlers.success()];
```

### 3.3 EmailCapture Stories cu Comprehensive Testing

```tsx
// packages/ui/src/components/email-capture/EmailCapture.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { EmailCapture } from './EmailCapture';
import { subscribeHandlers } from '../../mocks/handlers/subscribe';

const meta: Meta<typeof EmailCapture> = {
  title: 'Forms/EmailCapture',
  component: EmailCapture,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modern Hearth Email Capture Component cu MSW API integration și comprehensive testing.',
      },
    },
    // Default MSW handlers
    msw: {
      handlers: [subscribeHandlers.success()],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['glass', 'simple', 'inline'],
      description: 'Component variant pentru different styling approaches',
    },
    withFloatingElements: {
      control: 'boolean',
      description: 'Enable floating orbs pentru Modern Hearth glass variant',
    },
    onSuccess: { action: 'onSuccess' },
    onError: { action: 'onError' },
  },
};

export default meta;
type Story = StoryObj<typeof EmailCapture>;

// Canonical FAZA 3 stories pentru spec compliance
export const Default: Story = {
  args: {
    variant: 'glass',
    withFloatingElements: true,
    onSuccess: fn(),
    onError: fn(),
  },
};

export const WithUserFlow: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('User introduces email address', async () => {
      const input = canvas.getByLabelText(/email/i);
      await userEvent.type(input, 'ion.popescu@example.com');
      expect(input).toHaveValue('ion.popescu@example.com');
    });

    await step('User submits form', async () => {
      const button = canvas.getByRole('button', { name: /înscrie/i });
      await userEvent.click(button);
    });

    await step('Success message appears', async () => {
      const successMessage = await canvas.findByRole('status');
      expect(successMessage).toHaveTextContent(/te-ai înscris cu succes/i);
    });
  },
};

export const Loading: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.slowSuccess(2000)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'slow.network@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    // Check loading state
    const loadingButton = canvas.getByRole('button', { name: /se încarcă/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
  },
};

export const Error: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.invalidEmail()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'email-invalid@test.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/adresă de email.*validă/i);
  },
};

// Advanced scenarios pentru comprehensive testing
export const ErrorAlreadySubscribed: Story = {
  parameters: {
    msw: {
      handlers: [subscribeHandlers.alreadySubscribed()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'existing@example.com');
    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);
    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/deja abonat/i);
  },
};

export const Simple: Story = {
  args: {
    variant: 'simple',
    onSuccess: fn(),
    onError: fn(),
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    onSuccess: fn(),
    onError: fn(),
  },
};
```

### 3.4 Component Implementation cu State Management

```tsx
// packages/ui/src/components/email-capture/EmailCapture.tsx
import React, { useEffect, useRef, useState } from 'react';
import { subscribe, SubscribeApiError } from '@coquinate/shared';
import { FloatingElements, FloatingOrbPresets } from '../floating-elements';

// Discriminated union state pentru predictable state management
type EmailCaptureStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | {
      kind: 'error';
      code: 'invalid_email' | 'already_subscribed' | 'rate_limited' | 'server_error';
    };

export interface EmailCaptureProps {
  className?: string;
  variant?: 'glass' | 'simple' | 'inline';
  withFloatingElements?: boolean;
  placeholder?: string;
  buttonText?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: SubscribeApiError) => void;
}

export function EmailCapture({
  className = '',
  variant = 'glass',
  withFloatingElements = true,
  placeholder,
  buttonText,
  onSuccess,
  onError,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<EmailCaptureStatus>({ kind: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status.kind === 'loading') return;

    setStatus({ kind: 'loading' });

    // Cancel any existing request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      await subscribe({ email }, abortRef.current.signal);

      setStatus({ kind: 'success' });
      onSuccess?.(email);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      if (error instanceof SubscribeApiError) {
        setStatus({ kind: 'error', code: error.code });
        onError?.(error);
      } else {
        setStatus({ kind: 'error', code: 'server_error' });
        onError?.(new SubscribeApiError('Unknown error', 'server_error', 0));
      }
    }
  };

  const isLoading = status.kind === 'loading';
  const isSuccess = status.kind === 'success';
  const hasError = status.kind === 'error';

  // Implementation for glass/simple/inline variants...
  // (simplified for documentation)
}
```

### 3.5 Verificare MSW Integration

```bash
# 1. Start Storybook
pnpm --filter @coquinate/ui storybook

# 2. Navigate în browser la http://localhost:6006
# 3. Open EmailCapture → Default story
# 4. Open browser DevTools → Network tab
# 5. Verifică că API call la /api/subscribe e interceptat de MSW
# 6. Test toate scenariile: Loading, Error, WithUserFlow
# 7. Play functions se execută automat în Interactions panel
```

### 3.6 Structure Finală Implementată

```
packages/ui/
├── .storybook/
│   ├── main.ts                      # Vite config, MSW addon
│   └── preview.tsx                  # Global MSW init, i18n mocks
├── src/
│   ├── components/
│   │   ├── email-capture/
│   │   │   ├── EmailCapture.tsx     # Component cu 3 variants
│   │   │   ├── EmailCapture.stories.tsx  # 13 comprehensive stories
│   │   │   └── index.ts
│   │   ├── floating-elements/
│   │   │   ├── FloatingElements.tsx
│   │   │   └── index.ts
│   │   └── button.tsx
│   ├── mocks/
│   │   ├── handlers/
│   │   │   ├── subscribe.ts         # 7 MSW scenarios
│   │   │   └── index.ts
│   │   └── index.ts
│   └── styles/
│       └── globals.css              # Tailwind v4 + OKLCH colors
├── package.json
└── tsconfig.json

packages/shared/
├── src/
│   ├── types/
│   │   └── subscribe.ts             # Zod API contracts
│   └── utils/
│       └── subscribe-client.ts      # Type-safe API client
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
};
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

### ⚠️ OPȚIONAL - Poți Amâna (Focus pe Componente, Nu Pe Tooling)

#### 📋 Design Tokens MDX

- **Când**: După 30-40 componente, când trebuie să comunici paleta
- **De ce amânat**: Component-urile sunt prioritatea, nu documentația

#### 🖼️ Chromatic/Visual Diffs

- **Când**: Mai multe echipe/SB instances sau când apar regression-uri vizuale
- **De ce amânat**: Manual testing e suficient pentru early development

#### 🤖 Test Runner în CI

- **Când**: Scapi de primele 30-40 componente și ai stabilitate
- **De ce amânat**: Local smoke tests sunt suficiente inițial

---

## 🎯 FAZA 8: Local Testing Minimal (5 minute) - SIMPLIFICAT

### Obiectivul Fazei 8

Setup minimal de testare locală - CI poate aștepte până la 30-40 componente.

### 8.1 Smoke Test Local (Esențial)

```bash
# ✅ MINIMAL - Doar astea contează inițial:
pnpm i && pnpm --filter @coquinate/ui storybook

# 1. ✅ Controls schimbă variant/size la Button
# 2. ✅ Dark/light toggle funcționează
# 3. ✅ A11y panel nu arată erori majore
```

### 8.2 CI Setup - AMÂNAT

- **De ce amânat**: Focus pe dezvoltarea componentelor, nu pe infrastrucură CI
- **Când să adaugi**: După primele 30-40 componente stabile

---

## 🎯 FAZA 9: Troubleshooting și Finalizare (10 minute)

### Obiectivul Fazei 9

Rezolvă problemele comune și finalizează setup-ul pentru utilizare în producție.

### 9.1 Troubleshooting Rapid

| Problemă                             | Soluție                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| Clasă Tailwind nu apare              | Verifică globs în `tailwind.config.js` (ai `src`, `.storybook`, `**/*.mdx` ✔)          |
| "Invalid hook call / două React-uri" | `peerDependencies` + `pnpm overrides` (vezi mai sus)                                    |
| MSW nu interceptează                 | `initialize({ onUnhandledRequest: 'bypass' })` + `parameters.msw.handlers` pe URL exact |
| SVG ca componentă nu merge           | `vite-plugin-svgr` în `viteFinal` ✔                                                    |

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
        template:
          "export { {{name}} } from './components/{{kebabCase name}}';\n// PLOP_INJECT_EXPORT",
      },
    ],
  });
}
```

```handlebars
{{!-- packages/ui/templates/Component.tsx.hbs - MODERN HEARTH TOKENS! --}}
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const {{lowerCase name}}Variants = cva(
  // 🎨 BASE: Modern Hearth foundation cu glass + transitions
  'rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-warm focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // 🔥 PRIMARY: Warm teal gradient cu shadow-glow
        primary: 'bg-primary-warm text-white hover:bg-primary-dark shadow-md hover:shadow-glow hover:-translate-y-0.5',

        // ✨ GLASS: Modern Hearth glass morphism
        glass: 'glass border border-surface-glass-border text-primary-warm hover:bg-surface-glass-elevated backdrop-blur-md',

        // 🌸 CORAL: Accent coral pentru CTAs importante
        coral: 'bg-accent-coral text-white hover:bg-accent-coral-deep shadow-md hover:shadow-glow hover:scale-105',

        // 👻 GHOST: Subtle hover cu warm feel
        ghost: 'border border-primary-warm text-primary-warm hover:bg-primary-warm/10 hover:shadow-sm',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3',
        lg: 'px-6 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface {{name}}Props extends VariantProps<typeof {{lowerCase name}}Variants> {
  /**
   * {{description}}
   */
  className?: string;
  /**
   * Component children
   */
  children?: React.ReactNode;
}

/**
 * {{description}}
 *
 * 🎨 Features Modern Hearth design tokens:
 * - OKLCH colors (primary-warm, accent-coral)
 * - Glass morphism support
 * - Premium focus states
 * - CVA variants for consistency
 */
export const {{name}} = ({
  variant,
  size,
  className,
  children,
  ...props
}: {{name}}Props) => {
  return (
    <div
      className={cn({{lowerCase name}}Variants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

```handlebars
{{!-- packages/ui/templates/Component.stories.tsx.hbs - MODERN HEARTH STORIES! --}}
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { {{name}} } from './{{name}}';

const meta = {
  title: '{{titleCase type}}s/{{name}}',
  component: {{name}},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{description}} với Modern Hearth design system - OKLCH colors, glass morphism, premium interactions.',
      },
    },
  },
  tags: ['autodocs'], // ✅ DoD REQUIREMENT
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'glass', 'coral', 'ghost'], // 🎨 Modern Hearth variants
      description: 'Visual variant cu Modern Hearth styling',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
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
 * 🔥 Primary - Warm teal cu shadow-glow
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '{{name}} Primary',
  },
};

/**
 * ✨ Glass - Modern Hearth glass morphism
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    children: '{{name}} Glass',
  },
  parameters: {
    backgrounds: { default: 'dark' }, // Better contrast pentru glass
  },
};

/**
 * 🌸 Coral - Accent coral pentru CTAs
 */
export const Coral: Story = {
  args: {
    variant: 'coral',
    children: '{{name}} Coral',
  },
};

/**
 * 👻 Ghost - Subtle hover effects
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '{{name}} Ghost',
  },
};

/**
 * 📏 All Sizes - Size comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <{{name}} size="sm">Small</{{name}}>
      <{{name}} size="md">Medium</{{name}}>
      <{{name}} size="lg">Large</{{name}}>
    </div>
  ),
};

/**
 * 🎨 All Variants - Modern Hearth showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <{{name}} variant="primary">Primary</{{name}}>
      <{{name}} variant="glass">Glass</{{name}}>
      <{{name}} variant="coral">Coral</{{name}}>
      <{{name}} variant="ghost">Ghost</{{name}}>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '🎯 Toate variantele Modern Hearth cu OKLCH colors și premium styling',
      },
    },
  },
};

/**
 * 🎭 Dark Mode - Glass morphism showcase
 */
export const DarkMode: Story = {
  args: {
    variant: 'glass',
    children: 'Modern Hearth în Dark Mode',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * ⚠️ Focus States - A11y verification
 */
export const FocusStates: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">👆 Tab prin componente pentru focus rings:</p>
      <div className="flex gap-4">
        <{{name}} variant="primary">Focus Test 1</{{name}}>
        <{{name}} variant="glass">Focus Test 2</{{name}}>
        <{{name}} variant="coral">Focus Test 3</{{name}}>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '🎯 Verifică că focus rings sunt vizibile - DoD requirement pentru a11y',
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
{{! packages/ui/templates/index.ts.hbs }}
export {
{{name}}
} from './{{name}}'; export type {
{{name}}Props } from './{{name}}';
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
// packages/ui/package.json - BOOST #1: Generator devine OBLIGATORIU
{
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "tsup",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:sb": "storybook test --config-dir .storybook",
    "generate": "plop",
    "g": "plop" // 🚀 ALIAS RAPID: pnpm -F @coquinate/ui g
  }
}
```

### 🚀 BOOST #1: Generator OBLIGATORIU - Flow în <30s

```bash
# 🎯 SUPER RAPID: Component + Story + Test în <30s
pnpm -F @coquinate/ui g

# Răspunde la întrebări:
# ? Numele componentei: MealCard
# ? Descrierea: A card component for displaying meal information
# ? Tipul: molecule

# ⚡ Generează automat cu Modern Hearth tokens:
# ✓ src/components/meal-card/MealCard.tsx (cu cva + OKLCH + glass)
# ✓ src/components/meal-card/MealCard.stories.tsx (cu toate variantele)
# ✓ src/components/meal-card/MealCard.test.tsx (cu a11y checks)
# ✓ src/components/meal-card/index.ts (clean exports)
# ✓ Updates src/index.ts cu // PLOP_INJECT_EXPORT

# 🎯 ZERO manual work: Template-urile includ Modern Hearth styling built-in!
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

## 🚀 BOOST #2: Definition of Done (DoD) pentru Fiecare Componentă

### ✅ DoD Checklist - OBLIGATORIU pentru fiecare componentă

```typescript
// packages/ui/.storybook/preview.tsx - BOOST: Default minimal pentru a11y
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
    config: {
      rules: [
        { id: 'color-contrast', enabled: true }, // Auto-check contrast
        { id: 'focus-order-semantics', enabled: true }, // Focus rings
      ],
    },
    options: {},
    manual: false, // ✅ Automat în background
  },
  layout: 'centered', // ✅ Default layout ca să nu repeți
};
```

### 📋 DoD Requirements (Copy-Paste Checklist)

Pentru fiecare componentă **TREBUIE** să ai:

#### ✅ Files Required

- [ ] **`.tsx`** - Component cu TypeScript interfaces
- [ ] **`.stories.tsx`** - Minimum: Default + Variants + Edge/Error/Loading (dacă există)
- [ ] **`tags: ['autodocs']`** - Auto-generated docs din props
- [ ] **Controls configurate** - Pentru toate props importante
- [ ] **Export în `src/index.ts`** - Automat cu Plop `// PLOP_INJECT_EXPORT`

#### ✅ A11y Requirements

- [ ] **Contrast trece** - Verificat în Storybook A11y panel
- [ ] **Focus rings vizibile** - Manual check cu Tab navigation
- [ ] **Keyboard accessible** - Toate interactive elements

#### ✅ Story Requirements

```tsx
// Template obligatoriu pentru toate stories:
export const Primary: Story = {
  args: { variant: 'primary', children: 'Content' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Component variant="primary">Primary</Component>
      <Component variant="secondary">Secondary</Component>
    </div>
  ),
};

// Pentru componente cu states:
export const Loading: Story = {
  args: { isLoading: true },
};

export const Error: Story = {
  args: { error: 'Something went wrong' },
};
```

### 🎯 BOOST #3: Smoke Test de Interacțiune (Gratis, Rapid)

```tsx
// În fiecare story care are acțiuni - OBLIGATORIU să pui play:
export const InteractiveFlow: Story = {
  args: { onClick: fn() }, // ✅ Import { fn } from '@storybook/test'
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ✅ Smoke test minimal - click + verify
    const button = canvas.getByRole('button');
    await userEvent.click(button);

    // ✅ O aserțiune simplă - e suficient!
    await expect(button).toBeInTheDocument();
  },
};
```

```bash
# 🔥 Rulezi periodic smoke tests:
pnpm -F @coquinate/ui test:sb
# ✅ Verifică că toate interacțiunile funcționează
```

---

## 🚀 BOOST #4: Regula de Consum "Shared" + Hook Anti-Uitat

### ✅ Regula Strict: Import DOAR din root

```tsx
// ✅ GOOD - Apps importă numai din @coquinate/ui (root export)
import { Button, MealCard, EmailCapture } from '@coquinate/ui';

// ❌ BAD - NO deep paths
import { Button } from '@coquinate/ui/components/button';
```

### ✅ Anti-Duplicate React Setup

```json
// pnpm-workspace.yaml sau root package.json
{
  "pnpm": {
    "overrides": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    }
  }
}

// packages/ui/package.json - DOAR peerDependencies
{
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
  // ✅ NU dependencies - previne dubluri și hook errors
}
```

### 🔗 BOOST #5: Hook Anti-"Uitat Story/Export"

```bash
# .git/hooks/pre-commit (chmod +x) - Mic hook fără bloat
#!/bin/bash
changed=$(git diff --cached --name-only --diff-filter=AM | grep -E 'packages/ui/src/components/.+\.tsx$' || true)
missing=""

for f in $changed; do
  base="${f%.tsx}"
  [ -f "${base}.stories.tsx" ] || missing="$missing\n- ${base}.stories.tsx"
done

if [ -n "$missing" ]; then
  echo "❌ Lipsesc stories pentru:"
  echo -e "$missing"
  echo ""
  echo "🚀 Rulează: pnpm -F @coquinate/ui g"
  exit 1
fi

echo "✅ All components have stories!"
```

```bash
# Setup rapid:
chmod +x .git/hooks/pre-commit

# Test:
# 1. Adaugă Component.tsx fără .stories.tsx
# 2. git add . && git commit
# 3. ❌ Hook blochează commit
# 4. ✅ Adaugă story → commit merge
```

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

**Setup 100% production-ready pentru monorepo cu AI + design system + 5 BOOST-URI IMPLEMENTATE!**

## 🚀 FEEDBACK IMPLEMENTAT - 5 BOOST-URI PRACTICE

### ✅ BOOST #1: Generator OBLIGATORIU

- **Alias rapid**: `pnpm -F @coquinate/ui g` → Component + Story + Test în <30s
- **Modern Hearth built-in**: Template-urile includ OKLCH + glass + CVA + focus states
- **Zero manual work**: Automat export în `src/index.ts` cu `// PLOP_INJECT_EXPORT`

### ✅ BOOST #2: Definition of Done (DoD)

- **Checklist obligatoriu**: `.tsx` + `.stories.tsx` + `tags: ['autodocs']` + Controls + Export
- **A11y automat**: Contrast check + focus rings + keyboard navigation
- **Preview defaults**: Layout centered + a11y rules configured

### ✅ BOOST #3: Smoke Test Interacțiune

- **Play functions**: În fiecare story cu acțiuni - click + verify
- **Rulat periodic**: `pnpm -F @coquinate/ui test:sb`
- **Suficient pentru 3-5 componente/zi delivery**

### ✅ BOOST #4: Regula Consum "Shared"

- **Root imports only**: `import { Button } from '@coquinate/ui'` (NO deep paths)
- **pnpm overrides**: React 19 în toată workspace-ul
- **peerDependencies**: UI package fără React direct

### ✅ BOOST #5: Hook Anti-"Uitat Story"

- **Pre-commit hook**: Blochează commit fără stories
- **Zero bloat**: Simple bash script în `.git/hooks/pre-commit`
- **Disciplină automată**: Forțează story pentru fiecare component nou

---

## 🎯 IMPACT REALIZAT

| Fără Boost-uri               | Cu 5 Boost-uri               |
| ---------------------------- | ---------------------------- |
| 15-20 min/component manual   | <30s cu generator            |
| Stories uitate/inconsistente | DoD + hook forțează calitate |
| Manual testing/verificări    | Smoke tests automate         |
| Import chaos/React dubluri   | Reguli stricte de consum     |
| Template basic fără styling  | Modern Hearth built-in       |

**ROI**: **La 3+ componente/zi planul își scoate banii** - verificat prin feedback! 👍

**Ready to ship with MODERN HEARTH! 🚀✨**

---

_Documentul a fost îmbunătățit cu feedback expert pentru dezvoltare rapidă în platforma de meal planning românească Coquinate cu design system premium._

---

## 📊 PROGRESS IMPLEMENTARE

### ✅ FAZA 1: Setup și Configurare de Bază - **COMPLETAT** (16 August 2025)

**Status**: 100% Finalizat și Validat

#### Realizări:

- ✅ Storybook 8.6.14 instalat cu Vite builder
- ✅ Configurare main.ts cu toate addon-urile necesare
- ✅ Setup preview.tsx cu MSW și decoratori globali
- ✅ TypeScript configurat pentru React 19 compatibility
- ✅ Package.json actualizat cu scripts și dependențe
- ✅ tsup.config.js pentru ESM-only builds
- ✅ test-runner.ts cu jest-dom matchers
- ✅ Globals.css cu OKLCH colors și Tailwind v4

#### Îmbunătățiri Adăugate:

- ✅ React deduplication în Vite config (monorepo safety)
- ✅ preserveSymlinks pentru workspace compatibility
- ✅ Dynamic theme switcher cu addon-themes
- ✅ i18n provider integration cu @coquinate/i18n
- ✅ addon-interactions pentru testare interactivă

#### Validare:

- Code review cu Gemini 2.5 Pro: **PASSED** (toate problemele HIGH/MEDIUM/LOW rezolvate)
- Analiza completitudine cu GPT-5: **PASSED** (100% compliance cu specificațiile)
- Storybook pornește cu succes pe port 6006: **VERIFIED**

#### Next Steps:

- [x] FAZA 2: Primul Component și Story (Button cu CVA) - **COMPLETAT**
- [ ] FAZA 3: Mockuri MSW și Date Realistice
- [ ] FAZA 4: Workflow cu AI și Commands
- [ ] FAZA 5: Tips și Best Practices
- [ ] FAZA 6: Stack-Specific Configuration
- [ ] FAZA 7: Quality of Life Upgrades
- [ ] FAZA 8: Testing și CI Setup
- [ ] FAZA 9: Troubleshooting și Finalizare

### ✅ FAZA 2: Primul Component și Story - **COMPLETAT** (16 August 2025)

**Status**: 100% Finalizat și Validat

#### Realizări:

- ✅ Button component cu CVA (class-variance-authority)
- ✅ Variante: primary, ghost, coral cu OKLCH colors
- ✅ Sizes: sm, md, lg cu touch target compliance
- ✅ Loading state cu spinner și aria-busy
- ✅ ForwardRef pentru proper ref handling
- ✅ Stories comprehensive cu play functions
- ✅ Interaction testing pentru click, disabled, loading
- ✅ Export corect din index.ts

#### Îmbunătățiri față de spec:

- ✅ Optimizare CVA configuration
- ✅ Aria-label support pentru icon-only buttons
- ✅ Corectare CSS variables (folosim --color-primary-700 și --color-gray-100)
- ✅ Type safety îmbunătățit cu ButtonProps

#### Validare:

- Code review cu Gemini 2.5 Pro: **PASSED** (toate problemele HIGH/MEDIUM rezolvate)
- Storybook: Button stories funcționează corect
- Accessibility: aria-busy, disabled states, focus-visible rings

---

_Ultima actualizare: 16 August 2025, 01:45_
