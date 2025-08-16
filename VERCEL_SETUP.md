# Vercel Monorepo Configuration Guide (2025)

## 🔴 STATUS ACTUAL: 16 August 2025

### ✅ Ce Am Făcut Până Acum

1. **Vercel CLI v46.0.1** - Instalat global
2. **pnpm 10.14.0** - Actualizat de la 8.15.9
3. **Autentificare** - Logat cu administrator@coquinate.com
4. **Proiect Vercel pentru apps/web** - Creat și linked (projectId: prj_zsQIMvjGJYwbu57Naewc2VjXeSD1)
5. **Curățare** - Șters toate .vercel directories și proiectele vechi configurate greșit

### ⚠️ Problema Curentă: Build Errors

**STATUS**: Build failează cu erori TypeScript în workspace packages

#### Eroare Specifică:

```
packages/shared build: src/utils/contrast-audit.ts(9,10): error TS2614:
Module '"@coquinate/config/tailwind/design-tokens"' has no exported member 'modernHearthColors'
```

**Cauza**:

- `contrast-audit.ts` încearcă să importe `modernHearthColors`
- În `design-tokens.js` avem doar `semanticColors` și `darkModeColors`

### 🔧 Soluțiile Găsite Pentru Acest Proiect

#### SOLUȚIA 1: Deploy din Root cu outputDirectory

**De ce**: Vercel nu detecta Next.js când Root Directory era setat la apps/web

```json
// vercel.json (în root)
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npx pnpm@10.14.0 install",
  "buildCommand": "npx pnpm@10.14.0 run -r build",
  "outputDirectory": "apps/web/.next",
  "regions": ["fra1"]
}
```

#### SOLUȚIA 2: Folosire npx pnpm@10.14.0

**De ce**: Vercel folosea pnpm 6.35.1 default, incompatibil cu workspace:\* protocol

```bash
# În toate comenzile folosim npx pentru versiunea exactă
npx pnpm@10.14.0 install
npx pnpm@10.14.0 run -r build
```

#### SOLUȚIA 3: Build Recursiv cu -r flag

**De ce**: Trebuie să buildăm toate workspace packages în ordinea corectă de dependențe

```bash
# Buildează toate packages în ordinea dependențelor
pnpm run -r build
```

### 📝 Ce Mai Trebuie Făcut

#### 1. FIX URGENT: Rezolvă Build Errors

**Opțiunea A**: Refactorizare contrast-audit.ts (RECOMANDAT)

```typescript
// În loc de:
import { modernHearthColors, darkModeTokens } from '@coquinate/config/tailwind/design-tokens';

// Folosește:
import { semanticColors, darkModeColors } from '@coquinate/config/tailwind/design-tokens';

// Și actualizează referințele:
const tokens = isDarkMode ? { ...semanticColors, ...darkModeColors } : semanticColors;
```

**Opțiunea B**: Comentează temporar fișierul dacă nu e critic

```typescript
// Adaugă la începutul fișierului:
/* eslint-disable */
// @ts-nocheck
```

**Opțiunea C**: Excludere din build

```json
// În packages/shared/tsconfig.json
{
  "exclude": ["src/utils/contrast-audit.ts"]
}
```

#### 2. Test Build Local

```bash
# Verifică că totul buildează local întâi
pnpm run -r build

# Sau individual:
pnpm --filter @coquinate/config build
pnpm --filter @coquinate/shared build
pnpm --filter @coquinate/database build
pnpm --filter @coquinate/i18n build
pnpm --filter @coquinate/ui build
pnpm --filter @coquinate/web build
```

#### 3. Deploy apps/web

```bash
# După ce build-ul funcționează local
vercel --token x4HvdhwSXsTTSClew4aX3Ms9 --yes --prod
```

#### 4. Configurare apps/admin

```bash
# Creează proiect separat pentru admin
cd apps/admin

# Creează vercel.json
cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "cd ../.. && npx pnpm@10.14.0 install",
  "buildCommand": "cd ../.. && npx pnpm@10.14.0 --filter @coquinate/admin build",
  "outputDirectory": ".next",
  "regions": ["fra1"]
}
EOF

# Link și deploy
vercel link --token x4HvdhwSXsTTSClew4aX3Ms9 --yes
vercel --token x4HvdhwSXsTTSClew4aX3Ms9 --yes --prod
```

#### 5. Environment Variables

Setează în Vercel Dashboard pentru fiecare proiect:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-2.0-flash`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- Toate din `.env.example`

### 🔍 Diagnosticare Probleme

#### Verifică versiuni:

```bash
vercel --version  # Trebuie să fie 46.0.1
pnpm --version   # Trebuie să fie 10.14.0
node --version   # Trebuie să fie 22.x
```

#### Verifică proiecte Vercel:

```bash
vercel projects ls --token x4HvdhwSXsTTSClew4aX3Ms9
```

#### Verifică cine e logat:

```bash
vercel whoami --token x4HvdhwSXsTTSClew4aX3Ms9
```

### 📌 Note Importante

1. **NU folosi**: Root Directory setat la apps/web în Vercel Dashboard
2. **FOLOSEȘTE**: Deploy din root cu outputDirectory specificat
3. **NU folosi**: pnpm fără versiune (va folosi 6.35.1)
4. **FOLOSEȘTE**: npx pnpm@10.14.0 explicit
5. **NU ignora**: Ordinea de build a workspace packages
6. **VERIFICĂ**: Build-ul local înainte de deploy

### 🏗️ Arhitectura Finală (După ce totul funcționează)

```
MealPlan/
├── vercel.json           # Config pentru apps/web
├── apps/
│   ├── web/
│   │   └── .vercel/     # Link la proiect Vercel
│   └── admin/
│       ├── vercel.json  # Config pentru admin
│       └── .vercel/     # Link la proiect Vercel separat
└── packages/            # Toate buildează în ordine
```

### 🚨 Probleme Cunoscute și Soluții

| Problemă                        | Cauză                       | Soluție                              |
| ------------------------------- | --------------------------- | ------------------------------------ |
| "No Next.js version detected"   | Root Directory greșit       | Deploy din root cu outputDirectory   |
| "ERR_PNPM_UNSUPPORTED_ENGINE"   | pnpm 6.35.1 în loc de 10.x  | Folosește npx pnpm@10.14.0           |
| "workspace:\* not supported"    | npm în loc de pnpm          | Forțează pnpm prin npx               |
| "Module has no exported member" | Import greșit în TypeScript | Verifică ce exportă efectiv modulul  |
| "Command too long (>256 chars)" | Limitare Vercel API         | Folosește script separat sau -r flag |

---

_Document actualizat: 16 August 2025 - Status: Build errors în workspace packages_
