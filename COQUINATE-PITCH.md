# Coquinate - Platformă Inteligentă de Planificare a Meselor pentru Familiile Românești

## Ce rezolvă Coquinate?

**Problemă centrală:** Familiile românești cu venituri duale se confruntă zilnic cu "Ce gătim azi?" - o decizie epuizantă care durează 5-7 ore pe săptămână și duce la 2-3 călătorii ineficiente la cumpărături, utilizare excesivă a aplicațiilor de livrare și 25% risipă alimentară.

**Soluția Coquinate:** Planuri complete de mese săptămânale (mic dejun, prânz, cină, gustări) cu modele inteligente de gătit batch 1-3 zile care se potrivesc cu modul în care gătesc de fapt familiile românești.

## Propunerea de Valoare

### Pentru Familii

- **Elimină decizia zilnică:** 28 de mese complete planificate săptămânal
- **Economisește timp:** Reduce 3+ ore săptămânale de planificare și decizii
- **Reduce risipa:** 50% mai puțină risipă prin gătitul strategic în loturi
- **Economii financiare:** 200-400 RON/lună prin reducerea comenzilor de mâncare
- **Gătit inteligent:** Friptura de duminică devine sandwich-uri luni și orez prăjit marți

### Pentru Piață

- **Poziționare unică:** Singura platformă care oferă planuri culturale românești complete
- **Preț accesibil:** 50 RON/lună (550 RON/an cu economie de 50 RON)
- **Trial gratuit:** 3 zile fără card de credit, cu meniuri curate permanente
- **Piață neexploatată:** 4.8M utilizatori potențiali până în 2028

## Features Principale

### 1. Planificare Completă de Mese

- **28 mese pe săptămână:** mic dejun, prânz, cină și gustări
- **Scalare automată:** pentru 1-6 persoane
- **Tipuri de meniu:** Omnivor și Vegetarian
- **Publicare automată:** miercuri 14:00, notificări 18:00, vizibile joi 6:00

### 2. AI Chef Assistant (Gemini 2.0 Flash)

- **Asistent personal de gătit:** te ghidează pas cu pas prin rețete
- **Nu propune alternative:** te ajută cu rețeta actuală
- **Răspunsuri contextuale:** înțelege unde ești în procesul de gătit
- **Cache inteligent:** răspunsuri în <100ms pentru întrebări frecvente

### 3. Batch Cooking Inteligent

- **Modele 1-3 zile:** gătești strategică pentru mai multe mese
- **Transformări automate:** rămășițele devin noi mese
- **Vizualizare flux:** vezi conexiunile între mese în interfață
- **Logica românească:** se potrivește cu obiceiurile locale de gătit

### 4. Liste de Cumpărături Interactive

- **Generare automată:** din planul de mese săptămânal
- **Categorii personalizabile:** organizează după preferințe
- **Funcții căutare și sortare:** alfabetic sau după categorii
- **Export PDF și email:** pentru utilizare offline
- **Marchează „am deja":** optimizează lista

### 5. Sistem de Abonament Flexibil

- **Preț:** 50 RON/lună, 550 RON/an (economie 50 RON)
- **Trial 3 zile:** fără card de credit, meniuri permanente
- **Mod vacanță:** suspendare până la 4 săptămâni
- **Autoanulare:** accces până la sfârșitul perioadei plătite
- **Plăți:** Stripe (Visa/Mastercard) și PayPal

### 6. Dashboard Admin Avansat

- **Builder vizual:** creează planuri de mese cu interfață intuitivă
- **Validare AI:** verifică echilibrul nutrițional și logica rămășițelor
- **Import hibrid:** CSV/JSON, web scraping, generare AI
- **Management rețete:** organizare, testare, publicare
- **Autentificare 2FA:** securitate avansată

## Stack Tehnologic Modern

### Frontend

- **React 19.1.0** - Framework UI cu Server Components stabile
- **Next.js 15.4.6** - Framework full-stack cu App Router
- **TypeScript 5.9** - Type safety complete
- **Tailwind CSS 4.1.11** - Styling system cu native CSS variables
- **Zustand 5.0.7** - State management React 19 compatible

### Backend

- **Supabase** - Backend-as-a-Service complet
- **PostgreSQL 15** - Database cu Row Level Security
- **Edge Functions** - Deno 2.1 runtime, auto-scaling
- **tRPC 11.4.3** - Type-safe API cu Edge runtime support

### AI Integration

- **Gemini 2.0 Flash** - Model AI rapid și eficient
- **AI SDK 4.2** - Streaming și caching integrat
- **@ai-sdk/google** - Provider oficial pentru Gemini
- **Cache multi-nivel:** Static → localStorage → API cache

### Infrastructure

- **Vercel** - Hosting cu Edge Network global
- **Supabase EU-Central** - Frankfurt pentru latență mică
- **Stripe** - Procesare plăți pentru România
- **Upstash Redis** - Cache pentru răspunsuri AI

### Development

- **pnpm 8.15.9** - Monorepo management efficient
- **Vitest 3.2** - Testing framework rapid
- **Playwright 1.54** - E2E testing cu AI debugging
- **ESLint 9.33** - Linting cu flat config
- **Storybook 8.6** - Component development

## Arhitectura Aplicației

### Pattern-uri Arhitecturale

- **Jamstack:** Generare statică cu API routes dinamice
- **Edge-First:** Compute aproape de utilizatori români
- **Component-Based:** React 19 cu Server Components
- **Offline-First PWA:** Cache-first pentru rețele mobile inconsistente
- **API Gateway:** tRPC ca single entry point

### Cache Strategy Multi-Nivel

1. **Răspunsuri statice** (0ms) - Întrebări comune cu răspunsuri predefinite
2. **localStorage Cache** (50-100ms) - Răspunsuri personalizate recente
3. **Gemini Implicit Cache** (200-500ms) - Cache API cu 75% reducere
4. **Fresh API Calls** (800-2000ms) - Doar pentru cereri noi unice

**Țintă:** >50% reducere costuri prin cache inteligent

### Fluxuri de Date

- **Publishing:** Admin → AI validation → Database → Thursday 6 AM publish
- **User Journey:** Login → Plan view → Shopping lists → Cooking assistance
- **Payment:** Trial → Stripe checkout → Subscription management
- **Feedback:** Thumbs up/down → Analytics → Plan optimization

## Model de Business

### Pricing

- **Lunar:** 50 RON/lună
- **Anual:** 550 RON/an (economie 50 RON)
- **Trial:** 3 zile gratuit, fără card de credit
- **Refund:** 7 zile lunar, 30 zile anual

### Obiective

- **Lună 3:** 300 abonați plătitori
- **Conversie trial:** 30% țintă
- **Piață țintă:** 4.8M utilizatori potențiali 2028
- **Concurență:** Un competitor local (21K subscribers)

### Operațiuni

- **Costuri infrastructure:** <€100/lună pentru 1000 utilizatori
- **Content creation:** 2 săptămâni înainte de publicare
- **Suport:** Self-service prin dashboard utilizator

## Implementare și Timeline

### MVP Features (Prioritate 1)

- Sistema de planuri de mese complete
- AI Chef Assistant cu Gemini 2.0 Flash
- Liste de cumpărături interactive
- Sistem de plăți și trial
- Dashboard admin cu validare AI

### Advanced Features (Prioritate 2)

- PWA cu funcționalitate offline
- Analytics și optimizarea planurilor
- API OpenFoodFacts pentru date nutriționale
- Sistem de notificări email
- Instrumentar monitoring și logging

### Caracteristici Tehnice Critice

- **Performance:** <2s page load pe 4G
- **Disponibilitate:** 99.5% uptime
- **Securitate:** GDPR compliant, PCI via Stripe
- **Scalabilitate:** Serverless auto-scaling
- **i18n:** Romanian ca limbă primară

## Diferențiatori Competitivi

### Vs. Competiția Internațională

- **Cultural relevant:** Rețete și obiceiuri românești
- **Complete meals:** Nu doar cina, ci toate mesele
- **Batch cooking logic:** Modul real de gătit al familiilor
- **AI Chef Assistant:** Ghidare personalizată în gătit

### Vs. Soluțiile Locale

- **Tehnologie modernă:** React 19, AI integration
- **User experience:** Interface intuitivă, mobile-first
- **Automation:** Generate automate, fără intervenție manuală
- **Scalability:** Poate servi mii de utilizatori simultan

## Avantaj Competitiv Temporar

**Fereastra de oportunitate:** 12-18 luni înainte ca jucătorii internaționali să recunoască această piață neservită.

**Barriere de intrare crescute de:**

- **AI Chef Assistant:** Experiență tehnică complexă
- **Cultural knowledge:** Înțelegerea obiceiurilor românești
- **Local partnerships:** Relații cu furnizori locali
- **Content library:** 12+ săptămâni de planuri validate

Coquinate nu este doar o aplicație de planificare a meselor - este soluția completă pentru eliminarea oboselii decizionale zilnice a familiilor românești moderne, construită pe tehnologie de vârf și înțelegerea profundă a culturii culinare locale.
