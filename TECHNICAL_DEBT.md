# Technical Debt - Vercel Deployment Hacks

## ⚠️ ATENȚIE: Fix-uri Temporare Aplicate pentru Deploy

### 1. ❌ TypeScript Declarations Dezactivate în UI Package

**Fișier**: `packages/ui/tsup.config.ts`
**Ce am făcut**: Setat `dts: false` (era `true`)
**De ce**: tsup nu reușea să genereze declarațiile TypeScript
**Impact**:

- Nu se generează fișiere `.d.ts` pentru componente
- Apps care importă din @coquinate/ui nu au type checking
  **FIX NECESAR**:
- Rezolvă problema cu tsconfig.json în packages/ui
- Reactivează `dts: true`

### 2. ❌ Script onSuccess Dezactivat în UI Package

**Fișier**: `packages/ui/tsup.config.ts`
**Ce am făcut**: Comentat `onSuccess: 'node scripts/copy-styles.mjs'`
**De ce**: Vercel nu găsea scriptul la build
**Impact**:

- Styles din packages/ui/src/styles nu se copiază automat în dist/
- Poate cauza probleme cu importul de CSS
  **FIX NECESAR**:
- Integrează copierea styles direct în build process
- Sau folosește un alt mecanism pentru distribuția CSS

### 3. ⚠️ Admin App Exclus din Build

**Fișier**: `vercel.json`
**Ce am făcut**: `--filter='!@coquinate/admin'` în buildCommand
**De ce**: Admin avea multe erori TypeScript care blocau tot build-ul
**Impact**:

- Admin app nu se poate deploya pe Vercel momentan
  **FIX NECESAR**:
- Rezolvă erorile TypeScript din admin:
  - Import paths greșite (@mealplan/shared vs @coquinate/shared)
  - Tipuri lipsă pentru image.utils și image.types
  - Erori de tip în crypto.ts

### 4. ⚠️ Database Package Nu Are Build Real

**Fișier**: `packages/database/package.json`
**Ce am făcut**: Build script e doar `echo 'To be configured'`
**De ce**: Nu era configurat niciodată
**Impact**:

- Database package nu exportă nimic util
- Doar ocupă loc în dependencies
  **FIX NECESAR**:
- Configurează build real sau șterge package-ul dacă nu e necesar

## Comenzi pentru Verificare

```bash
# Verifică ce packages au probleme de build
pnpm run -r build

# Testează build-ul pentru admin separat
pnpm --filter @coquinate/admin build

# Verifică dacă UI package generează declarații
pnpm --filter @coquinate/ui build
ls packages/ui/dist/*.d.ts  # Ar trebui să existe fișiere .d.ts
```

## Ordinea de Rezolvare Recomandată

1. **Prima dată**: Fix TypeScript errors în admin
2. **Apoi**: Reactivează dts în UI package
3. **La final**: Integrează copy-styles proper
4. **Opțional**: Decide ce faci cu database package

## Note Importante

- Build-ul local funcționează pentru web app
- Deployment-ul pe Vercel funcționează DOAR pentru web app
- Admin app NU poate fi deployat până nu rezolvi erorile

---

_Document creat: 16 August 2025_
_Motiv: Deployment urgent necesar pentru web app_
