# V0 Landing Page - INSPIRAȚIE VIZUALĂ

## ⚠️ IMPORTANT: DOAR REFERINȚĂ - NU IMPORTA DIRECT!

Acest folder conține componentele generate de **v0.app** care au reprodus PERFECT mockup-ul nostru.
**Acestea servesc ca REFERINȚĂ VIZUALĂ și SPECIFICAȚII**, nu ca bază de cod pentru import direct.

## ✅ Ce facem cu acest cod:
- Îl folosim ca **blueprint vizual** pentru a reconstrui componente
- Extragem **pattern-uri de animație** și efecte vizuale
- Adaptăm **structura componentelor** la arhitectura noastră
- Preluăm **idei de micro-interacțiuni** și UX enhancements

## ❌ Ce NU facem:
- NU importăm direct aceste componente în aplicație
- NU folosim CSS variables custom din globals.css
- NU păstrăm texte hardcodate
- NU folosim lucide-react în loc de @tabler/icons

## 🗂️ Structura

### Componente Principale

#### **hero-section.tsx**
- Hero section principal cu workflow visualization
- Include statistici (5 ore economisite, 50% risipă redusă, 400 RON)
- Responsive pentru desktop și mobile
- Integrează `EmailCapture` și `ProgressIndicator`

#### **features-section.tsx**
- 4 feature cards cu iconițe
- Animații la scroll (folosește `use-scroll-animation`)
- Features: Ingrediente locale, Listă cumpărături, Zero risipă, Chef AI

#### **cta-section.tsx**
- Call-to-action section cu gradient background
- Buton care scrollează la email capture

#### **workflow-visualization.tsx**
- Vizualizare interactivă a workflow-ului în 3 pași
- Desktop: layout cu SVG și animații
- Mobile: layout compact vertical

### Componente de Suport

#### **progress-indicator.tsx**
- Afișează progresul înregistrărilor (347/500 locuri)
- Animație counter la mount
- Progress bar cu gradient

#### **email-capture.tsx**
- Formular de capturare email cu validare
- GDPR consent checkbox
- Success state cu confetti și share buttons
- Integrare cu localStorage pentru mock submit

#### **share-component.tsx**
- Butoane de share pentru social media
- Suport pentru: Facebook, WhatsApp, Email, Copy link
- Native share API pentru mobile

#### **floating-share.tsx**
- Buton flotant de share în colțul dreapta-jos
- Modal cu `ShareComponent`

#### **confetti-effect.tsx**
- Efect confetti pentru success state
- Se activează când utilizatorul se înregistrează

#### **sound-toggle.tsx**
- Toggle pentru activare/dezactivare sunete
- Salvează preferința în localStorage
- Funcție `playSuccessSound()` exportată

#### **floating-particles.tsx**
- Particule animate pentru background
- Efect vizual decorativ

#### **navigation.tsx**
- Componenta de navigare (simplă)

#### **footer.tsx**
- Footer cu social links
- Easter egg la click pe logo (după 5 click-uri)
- "Făcut cu ❤️ în România"

#### **scroll-progress.tsx**
- Progress bar care arată cât din pagină a fost scrollat

### Componente UI (shadcn/ui)

#### **ui/button.tsx**
- Buton component cu variante
- Compatibil cu shadcn/ui

#### **ui/input.tsx**
- Input component pentru formulare

#### **ui/checkbox.tsx**
- Checkbox cu Radix UI
- Folosit pentru GDPR consent

### Hooks

#### **use-scroll-animation.ts**
- Hook pentru animații bazate pe scroll
- Folosește Intersection Observer
- Returnează `ref` și `isVisible`

### Stiluri

#### **globals.css**
- CSS variables pentru design system
- Animații CSS (@keyframes)
- Utility classes pentru efecte

## ⚠️ Probleme cunoscute

1. **Iconițe**: Folosesc `lucide-react` în loc de `@tabler/icons-react`
   - Am înlocuit parțial cu script-ul `fix-icons.sh`
   - Verifică toate importurile înainte de folosire

2. **CSS Variables**: Folosesc propriile lor variabile CSS
   - Trebuie adaptate la design tokens (OKLCH colors)
   - Vezi `globals.css` pentru lista completă

3. **Texte hardcodate**: Tot conținutul e în română hardcodat
   - Trebuie înlocuit cu `useTranslation` și i18n keys

4. **Paths**: Importurile folosesc `@/` care se referă la `src/`
   - Trebuie ajustate pentru structura noastră

## 🔧 Cum să folosești

### Opțiunea 1: Import direct (nu recomandat)
```tsx
import { HeroSection } from '@coquinate/ui/v0-landing/hero-section'
```

### Opțiunea 2: Adaptare și integrare (recomandat)
1. Copiază componenta în locația potrivită
2. Înlocuiește CSS variables cu design tokens
3. Adaugă i18n pentru toate textele
4. Ajustează importurile și iconițele
5. Testează în Storybook

## 📝 Design Tokens folosite

```css
/* Culori principale */
--primary-warm: #FF6B35
--accent-coral: #FF8C61
--accent-coral-soft: #FFB69E

/* Suprafețe */
--surface-white: #FFFFFF
--surface-eggshell: #FFF8F3
--dark-surface: #1A0F0A

/* Text */
--text-primary: #2C1810
--text-secondary: #5C453A
--text-muted: #8B7265
--text-light: #F5F0EC

/* Borders & Shadows */
--border-light: #E5D5CE
--shadow-soft: 0 2px 8px rgba(0,0,0,0.08)
```

## 🚀 Next Steps

1. **Decizie arhitecturală**: Folosim aceste componente sau le refacem?
2. **Adaptare**: Dacă le păstrăm, trebuie adaptate complet
3. **Storybook**: Creează stories pentru fiecare componentă
4. **Testing**: Adaugă teste pentru funcționalitate

## 📌 Note

- Acestea sunt componente **client-side** (`"use client"`)
- Folosesc React hooks (useState, useEffect)
- Au dependență de Radix UI pentru unele componente
- Design-ul e modern și atractiv dar necesită adaptare