# Technical Debt - Vercel Deployment

## ✅ Fix-uri Aplicate (16 August 2025)

### 1. ✅ Script onSuccess Reactivat în UI Package

**Fișier**: `packages/ui/tsup.config.ts`
**Ce am făcut**: Reactivat `onSuccess: 'node scripts/copy-styles.mjs'`
**Status**: REZOLVAT - scriptul funcționează și copiază styles în dist/

### 2. ✅ Database Package Referințe Înlăturate

**Fișiere**:

- `apps/admin/tsconfig.json`
  **Ce am făcut**: Înlăturat toate referințele la packages/database care nu mai există
  **Status**: REZOLVAT - package-ul nu era folosit și a fost șters

### 3. ✅ Build pentru Web App Funcțional

**Status**: Build-ul pentru @coquinate/web funcționează local și pe Vercel
**Verificat**: `pnpm --filter @coquinate/web build` - SUCCESS

## ⚠️ Probleme Rămase

### 1. ✅ TypeScript Declarations Activate în UI Package

**Fișier**: `packages/ui/tsup.config.ts`
**Status**: `dts: true` - ACTIVAT și funcțional
**Fix-uri aplicate**:

- StaggerList: Rezolvat erori JSX namespace și ElementType
- CountdownTimer, useGPUOptimization, usePerformanceMonitor: Adăugat valori inițiale pentru useRef
- InteractiveCard: Refactorizat pentru a gestiona corect ref-urile polimorfice
- EmailCapture: Corectat importurile pentru TranslationNamespace
- NavigationMenu: Refactorizat pentru a gestiona corect elementele button/anchor

**Rezultat**:

- Se generează cu succes `dist/index.d.ts` (25.76 KB)
- Apps care importă din @coquinate/ui au type checking complet

### 2. ⚠️ Admin App Nu Poate Fi Build-uit

**Status**: Multiple erori TypeScript
**Probleme principale**:

- Import paths greșite: `@mealplan/shared` vs `@coquinate/shared`
- Fișiere lipsă: `test/test-utils`, `test/i18n-test-utils`
- Erori de tip în `crypto.ts`
- Referințe la tipuri care nu există: `image.utils`, `image.types`

**FIX NECESAR**:

1. Înlocuiește toate `@mealplan/shared` cu `@coquinate/shared`
2. Creează sau șterge referințele la fișierele de test
3. Fix type errors în crypto.ts
4. Verifică și corectează importurile de tipuri

## Comenzi de Verificare

```bash
# Verifică build pentru web (funcționează)
pnpm --filter @coquinate/web build

# Verifică build pentru admin (nu funcționează încă)
pnpm --filter @coquinate/admin build

# Build complet (va eșua la admin)
pnpm run -r build
```

## Status Curent

✅ **Web App**: Deployabil pe Vercel, build funcțional
✅ **UI Package**: Build funcțional, styles se copiază corect, TypeScript declarations activate
❌ **Admin App**: Nu poate fi build-uit, exclus din Vercel

## Următorii Pași Prioritari

1. **Când e nevoie de Admin**: Fix toate erorile TypeScript din admin app

---

_Document actualizat: 16 August 2025_
_Status: Web app deployabil, admin app necesită fix-uri_
