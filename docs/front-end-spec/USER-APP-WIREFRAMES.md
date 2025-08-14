# USER APP WIREFRAMES

Toate wireframes-urile pentru aplicația utilizatorilor Coquinate - interfața principală cu care interacționează clienții români.

## WIREFRAMES MOBILE (MOBILE-FIRST DESIGN)

### 1. Week View Dashboard - Mobile

**Purpose:** Vedere principală săptămânală cu planul de masă per FR1, FR2, FR7

**Layout:**

```
┌──────────────────────────────────┐
│ 🍽️ Coquinate          👤 Cont    │
├──────────────────────────────────┤
│ ⚡ 3+ ore economisit săptămâna   │
├──────────────────────────────────┤
│ ◄ 15-21 Ianuarie 2025 ►         │
│ [Vezi săptămâna trecută]         │
├──────────────────────────────────┤
│ L  M  Mi  J  V  S  D            │
│ 15 16 17★ 18 19 20 21           │
├──────────────────────────────────┤
│ [Glisează pentru alte zile →→→]  │
│┌─────┬─────┬─────┬─────┐        │
││ LUN │ MAR │ MIE │ JOI │→→→     │
│├─────┼─────┼─────┼─────┤        │
││ 🥐  │ 🥞  │ 🍳  │ 🥣  │ MIC    │
││15m ✓│20m ✓│10m ✓│5m □ │ DEJ    │
│├─────┼─────┼─────┼─────┤        │
││ 🍲  │ 🥗  │ 🍝  │ 🍕  │ PRÂNZ  │
││30m ✓│↩️5m ✓│25m □│↩️5m □│        │
│├─────┼─────┼─────┼─────┤        │
││ 🍖  │ 🐟  │ 🍗  │ 🥩  │ CINĂ   │
││45m ✓│30m □│30m □│25m □│        │
│├─────┼─────┼─────┼─────┤        │
││ 🍎  │ 🥜  │ 🍌  │ 🥨  │ GUSTARE│
││ ✓   │ ✓   │ □   │ □   │        │
│└─────┴─────┴─────┴─────┘        │
│                                  │
│ Săptămâna: ███░░░ 45% completă   │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont   │
└──────────────────────────────────┘
```

**Key Elements:**

- Vedere săptămânală cu 7×4 grid pentru mese
- Indicatori timp de gătit cu badge-uri (<30min pentru cine din săptămână)
- Săgeți pentru fluxul de resturi între mese conectate
- Funcționalitate "Marchează ca gătit" (FR7)
- Coloana "Azi" evidențiată
- Buton acces listă cumpărături (FR6)

### 2. Today Focus View - Mobile

**Purpose:** Vedere focalizată pe mesele zilei curente per FR32

**Layout:**

```
┌──────────────────────────────────┐
│ ⚠️ Perioada de test: Ziua 2 din 3│
├──────────────────────────────────┤
│ ◄ Miercuri, 17 Ianuarie         │
│    Pentru 4 persoane 👨‍👩‍👧‍👦         │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ MIC DEJUN        ✓ GĂTIT   │  │
│ │ ┌────┐                     │  │
│ │ │ 🍳 │ Omletă (8 ouă)      │  │
│ │ └────┘ 10 minute           │  │
│ │ [👍] [👎]  [Vezi Rețeta ▼] │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ PRÂNZ            ✓ GĂTIT   │  │
│ │ ┌────┐                     │  │
│ │ │ 🍝 │ Paste (500g)        │  │
│ │ └────┘ 25 minute           │  │
│ │ ⚠️ Din resturile de ieri    │  │
│ │ [👍] [👎]  [Vezi Rețeta ▼] │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ CINĂ             □ NEGĂTIT │  │
│ │ ┌────┐                     │  │
│ │ │ 🍗 │ Pui (1.5kg)         │  │
│ │ └────┘ 30 minute           │  │
│ │ [Marchează ca gătit]       │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ NUTRIȚIE AZI (per persoană) │  │
│ │ Calorii: 2,150 kcal        │  │
│ │ Proteine: 95g │ Fibre: 28g │  │
│ │ Carbs: 245g │ Grăsimi: 82g │  │
│ └────────────────────────────┘  │
│                                  │
│ Mâine: Ciorbă, Salată... ►      │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont   │
└──────────────────────────────────┘
```

**Key Elements:**

- Cards mari pentru mesele zilei cu detalii rețete
- Porții scalate la gospodărie (FR5)
- Feedback thumbs up/down după gătit (FR7)
- Preview pentru mâine la fund
- Informații nutriționale

### 3. Shopping List Interface - Mobile

**Purpose:** Listă interactivă de cumpărături săptămânală per FR6, FR12, FR28

**Layout:**

```
┌──────────────────────────────────┐
│ 🛒 Listă Cumpărături             │
│ ┌──────────────────────────────┐ │
│ │ 🔍 Caută ingredient...       │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ [A-Z ▼] [Categorii ▼] [📄 PDF]  │
│ [✉️ Email] [⚙️ Personalizează]   │
├──────────────────────────────────┤
│ LACTATE (3)              [-][+] │
│ ┌────────────────────────────┐  │
│ │ ○ Lapte 2L            [⊖]  │  │
│ │ ○ Brânză 500g         [⊖]  │  │
│ │ ○ Smântână 200ml      [⊖]  │  │
│ └────────────────────────────┘  │
│                                  │
│ CARNE (4)                 [-][+] │
│ ┌────────────────────────────┐  │
│ │ ✓ Piept de pui 1kg         │  │
│ │ ○ Carne vită 500g     [⊖]  │  │
│ │ ○ Bacon 200g          [⊖]  │  │
│ │ ⊖ Salam (am deja)          │  │
│ └────────────────────────────┘  │
│                                  │
│ LEGUME (5)                [-][+] │
│ ┌────────────────────────────┐  │
│ │ ○ Roșii 1kg           [⊖]  │  │
│ │ ○ Ceapă 500g          [⊖]  │  │
│ │ ○ Ardei 3 buc         [⊖]  │  │
│ │ ○ Cartofi 2kg         [⊖]  │  │
│ │ ○ Morcovi 500g        [⊖]  │  │
│ └────────────────────────────┘  │
│                                  │
│ Progres: ████░░░░░░ 3/15 articole│
├──────────────────────────────────┤
│ [Marchează toate ca „am deja"]  │
└──────────────────────────────────┘

Legendă:
○ = De cumpărat
✓ = Cumpărat
⊖ = Am deja
[+][-] = Extinde/Restrânge categorie
```

**Key Elements:**

- Ingrediente categorizate (personalizabile per FR28)
- Bară de căutare (FR6)
- Cercuri check-off (FR12)
- Marcare "Am deja" (FR12)
- Buton export PDF (FR6)

### 4. Recipe Detail View (Cooking Mode) - Mobile

**Purpose:** Optimizat pentru gătit cu mâinile murdare

**Layout:**

```
┌──────────────────────────────────┐
│ ◄ Înapoi la Săptămână           │
├──────────────────────────────────┤
│ [======= Imagine Rețetă =======] │
│                                  │
│ PAPRICAȘ DE PUI                  │
│ ⏱️ 30 min  👥 2 porții           │
├──────────────────────────────────┤
│ INGREDIENTE                      │
│ • 500g pulpe pui                 │
│ • 2 cepe                         │
│ • 3 linguri boia                 │
│ • 200ml smântână                 │
├──────────────────────────────────┤
│ PASUL 1 DIN 5                   │
│                                  │
│ Taie puiul bucăți.              │
│ Condimentează cu sare și piper.  │
│                                  │
│ [◄ Anterior]  [Pasul Următor ►] │
├──────────────────────────────────┤
│ [Marchează ca Gătit ✓]          │
└──────────────────────────────────┘
```

**Cooking Mode Features:**

- Target-uri mari de atingere (min 60px)
- Vedere pas-cu-pas (fără scroll)
- Wake lock pentru a preveni somnul ecranului
- Gata pentru controlul vocal (feature viitor)

### 5. Account/Settings Screen - Mobile

**Purpose:** Gestionare cont și preferințe per FR4, FR27, FR19, FR32

**Layout:**

```
┌──────────────────────────────────┐
│ ◄ Contul Meu                     │
├──────────────────────────────────┤
│ maria@exemplu.com                │
├──────────────────────────────────┤
│ PREFERINȚE GOSPODĂRIE            │
│ ┌────────────────────────────┐  │
│ │ Număr persoane: [slider 1-6]│ │
│ │ ◉ 4 persoane               │  │
│ │                             │  │
│ │ Tip meniu:                  │  │
│ │ ○ Omnivor  ● Vegetarian    │  │
│ └────────────────────────────┘  │
│                                  │
│ SETĂRI SĂPTĂMÂNĂ CURENTĂ         │
│ ┌────────────────────────────┐  │
│ │ □ Am oaspeți săptămâna asta│  │
│ │ □ Mod vacanță (pauză)      │  │
│ └────────────────────────────┘  │
│                                  │
│ PREFERINȚE AFIȘARE               │
│ ┌────────────────────────────┐  │
│ │ Pagina implicită:          │  │
│ │ ● Săptămână  ○ Azi         │  │
│ └────────────────────────────┘  │
│                                  │
│ ABONAMENT                        │
│ ┌────────────────────────────┐  │
│ │ Plan: Lunar - 50 RON       │  │
│ │ Următoarea plată: 1 Feb   │  │
│ │ [Gestionează Abonament]    │  │
│ └────────────────────────────┘  │
│                                  │
│ [Istoricul Meselor (4 săpt)]    │
│ [Rețetele Mele de Test]         │
│ [Ajutor și Asistență]           │
│ [Deconectare]                   │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont   │
└──────────────────────────────────┘
```

**Key Elements:**

- Configurare mărimea gospodăriei (FR5)
- Selecție tip meniu (FR4, FR27)
- Toggle mod vacanță (FR19)
- Preferința paginii implicite (FR32)
- Management abonament
- Acces la datele istorice ale meselor

### 6. Previous Week View (Read-Only) - Mobile

**Purpose:** Istoric săptămâni anterioare cu status gătit

**Layout:**

```
┌──────────────────────────────────┐
│ ◄ Săpt 8-14 Ian 2024           │
│    (Săptămâna trecută)          │
├──────────────────────────────────┤
│ L  │ M  │ Mi │ J  │ V  │ S │ D  │
│----|----|----|----|----|---|----│
│ 🥣 │ 🥣 │ 🥣 │ 🥣 │ 🥣 │🥣│ 🥣│
│ ✅ │ ✅ │ ✅ │ ❌ │ ✅ │✅│ ✅│
│----|----|----|----|----|---|----│
│ 🥙 │ 🥗 │ 🥙 │ 🥗 │ 🥙 │🍕│ 🥙│
│ ✅ │ ✅ │ ❌ │ ✅ │ ✅ │✅│ ✅│
│----|----|----|----|----|---|----│
│ 🍝 │ 🍲 │ 🍲 │ 🍕 │ 🍖 │🐟│ 🥩│
│ ✅ │ ✅ │ ✅ │ ✅ │ ❌ │✅│ ❌│
│----|----|----|----|----|---|----│
│ 🍰 │ 🍓 │ 🍰 │ 🍓 │ 🍰 │🧁│ 🍪│
│ ✅ │ ✅ │ ❌ │ ✅ │ ✅ │✅│ ✅│
├──────────────────────────────────┤
│ ✅ = gătit                       │
│ ❌ = sărit                       │
├──────────────────────────────────┤
│ 23/28 mese gătite (82%)         │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont   │
└──────────────────────────────────┘
```

## WIREFRAMES DESKTOP

### 7. Week View Dashboard - Desktop

**Purpose:** Vedere mai detaliată pentru desktop cu mai multe informații vizibile

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Coquinate                                         ⚡3+ ore saved     👤 Profile   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                        ◄ Săptămâna 15-21 Ianuarie 2025 ►              [🛒 Listă]    │
├────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│        │   LUN    │   MAR    │  ★MIE★   │   JOI    │   VIN    │   SÂM    │   DUM    │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ MIC    │ 🥐 15min │ 🥞 20min │ 🍳 10min │ 🥣 5min  │ 🧇 15min │ 🥓 25min │ 🍩 10min │
│ DEJ    │    ✓     │    ✓     │    ✓     │    □     │    □     │    □     │    □     │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ PRÂNZ  │ 🍲 30min │ 🥗 ↩️5min│ 🍝 25min │ 🍕 ↩️5min│ 🥘 45min │ 🍜 ↩️10m │ 🍛 2h    │
│        │    ✓     │    ✓     │    □     │    □     │    □     │    □     │ BATCH!   │
│        │          │    ↑──────────────────────┘     │    ↑──────────────────┘       │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ CINĂ   │ 🍖 45min │ 🐟 30min │ 🍗 30min │ 🥩 25min │ 🍔 20min │ 🍱 ↩️5min│ 🥧 ↩️10m │
│        │    ✓     │    □     │    □     │    □     │    □     │    □     │    □     │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ SNACK  │  🍎 ✓   │  🥜 ✓   │  🍌 □   │  🥨 □   │  🍇 □   │  🍰 □   │  🍪 □   │
├────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┤
│ Săptămâna: ████████░░░░░░░░░░░░ 40% completă         [📄 Export PDF]                │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**

- Vedere completă 7×4 pentru toate mesele
- Săgeți vizibile pentru conexiunile de resturi
- Indicatori batch cooking evidențiați
- Acces rapid la listă și export

### 8. Shopping List - Desktop

**Purpose:** Vedere mai detaliată pentru planificare

**Layout:**

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 🛒 Listă Cumpărături - Săptămâna 15-21 Ianuarie      [📄 PDF] [✉️ Email] [⚙️ Set] │
├────────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Caută ingrediente...                                                           │
├────────────────┬───────────────────────────┬──────────────────────────────────────┤
│ CATEGORII      │ ARTICOLE (15 total)       │ COST ESTIMAT                         │
├────────────────┼───────────────────────────┼──────────────────────────────────────┤
│ ✓ LACTATE (3)  │ ○ Lapte 2L          [⊖]  │ Total: ~380 RON                      │
│ ⊕ CARNE (4)    │ ○ Brânză 500g       [⊖]  │                                      │
│ ⊖ LEGUME (5)   │ ○ Smântână 200ml    [⊖]  │ Lac: 45 RON                         │
│ ○ PÂINE (2)    │                           │ Car: 125 RON                        │
│ ○ CONDIMENTE   │ ✓ Piept pui 1kg           │ Leg: 85 RON                         │
│   (3)          │ ○ Carne vită 500g   [⊖]  │ Alt: 125 RON                         │
│                │ ○ Bacon 200g        [⊖]  │                                      │
│ [+] Adaugă     │ ⊖ Salam (am deja)         │ [Optimizează costul]                 │
│ Categorie      │                           │                                      │
│                │ ○ Roșii 1kg         [⊖]  │ STATISTICI                           │
│ [⚙️] Reorde-   │ ○ Ceapă 500g        [⊖]  │ • Medie: 95 RON/person              │
│ nează          │ ○ Ardei 3 buc       [⊖]  │ • Economie: 180 RON vs               │
│ Categorii      │ ○ Cartofi 2kg       [⊖]  │   restaurant                         │
│                │ ○ Morcovi 500g      [⊖]  │ • Mese: 28                           │
├────────────────┴───────────────────────────┼──────────────────────────────────────┤
│ Progres: ████░░░░░░░░ 3/15 (20%)           │ [Marchează toate ca gătite]         │
│                                            │ [Reset lista]                        │
└────────────────────────────────────────────┴──────────────────────────────────────┘

Legendă: ○ = De cumpărat, ✓ = Cumpărat, ⊖ = Am deja, [⊖] = Buton "am deja"
```

## ONBOARDING & STĂRI SPECIALE

### 9. Onboarding Flow

#### Step 1: Trial Welcome

```
┌──────────────────────────────────┐
│      Bine ai venit! 👋        ║
├──────────────────────────────────┤
│                                  │
│  Primești 3 zile gratuite        │
│  să testezi Coquinate            │
│                                  │
│  ✓ Plan complet pentru o         │
│    săptămână                     │
│  ✓ Listă de cumpărături          │
│  ✓ Rețete pas cu pas             │
│  ✓ Fără card necesar             │
│                                  │
│  [Începe perioada de test →]     │
│                                  │
│  Deja ai cont? [Loghează-te]     │
│                                  │
└──────────────────────────────────┘
```

#### Step 2: Preferences

```
┌──────────────────────────────────┐
│   Să personalizăm meniurile      │
├──────────────────────────────────┤
│                                  │
│  Câte persoane?                  │
│  [1] [2] [3] [4+]                │
│                                  │
│  Alergii/Restricții?             │
│  □ Fără gluten                   │
│  □ Fără lactate                  │
│  □ Vegetarian                    │
│  □ Fără nucifere                 │
│                                  │
│  Ce nu-ți place?                 │
│  [ex: ciuperci, fructe de mare]  │
│  [_________________________]    │
│                                  │
│  [◄ Înapoi] [Continuă →]         │
│                                  │
└──────────────────────────────────┘
```

#### Step 3: First Week Preview

```
┌──────────────────────────────────┐
│  Săptămâna ta e gata! 🎉         │
├──────────────────────────────────┤
│                                  │
│  Lun: Omletă→Salată→Curry        │
│  Mar: Iaurt→Wrap→(resturi)       │
│  Mie: Ovăz→Sandwich→Paste        │
│                                  │
│  Total timp gătit: 3.5 ore       │
│  Cost estimat: 380 RON           │
│                                  │
│  Plata după 3 zile:              │
│  • 50 RON/lună                   │
│  • Anulezi oricând               │
│  • Primești săpt. curentă        │
│                                  │
│  [Vezi meniul complet →]         │
│                                  │
└──────────────────────────────────┘
```

### 10. Loading & Error States

#### Loading State (Skeleton Screen)

```
┌──────────────────────────────────┐
│  ◄ ░░░░░░░░░░░░░░░░░ ►          │
├──────────────────────────────────┤
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│-----|-----|-----|-----|--------│
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│-----|-----|-----|-----|--------│
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│-----|-----|-----|-----|--------│
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
│ ░░░ │ ░░░ │ ░░░ │ ░░░ │ ░░░   │
├──────────────────────────────────┤
│       Se încarcă...              │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont  │
└──────────────────────────────────┘
```

#### Error State (Network Issue)

```
┌──────────────────────────────────┐
│        Coquinate                 │
├──────────────────────────────────┤
│                                  │
│         ⚠️                       │
│                                  │
│   Nu am putut încărca            │
│   săptămâna ta                   │
│                                  │
│   Verifică conexiunea            │
│   la internet                    │
│                                  │
│   [Încearcă din nou]             │
│                                  │
│   [Contactează suport]           │
│                                  │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont  │
└──────────────────────────────────┘
```

### 11. Empty States

#### No Meals Planned (Admin Error)

```
┌──────────────────────────────────┐
│        Săptămâna ta              │
├──────────────────────────────────┤
│                                  │
│         📭                       │
│                                  │
│   Încă nu ai meniuri             │
│   pentru această săptămână       │
│                                  │
│   Revino luni dimineața          │
│   pentru noul meniu!             │
│                                  │
│   [Notifică-mă]                  │
│                                  │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont  │
└──────────────────────────────────┘
```

#### Shopping List Complete

```
┌──────────────────────────────────┐
│     Lista Completă! 🎉          │
├──────────────────────────────────┤
│                                  │
│      ✅✅✅✅✅                  │
│                                  │
│  Toate ingredientele sunt        │
│  marcate ca cumpărate!           │
│                                  │
│  Acum să gătești cu drag! 👨‍🍳     │
│                                  │
│  [Vezi rețetele →]               │
│  [Lista următoare săpt →]       │
│                                  │
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont  │
└──────────────────────────────────┘
```

### 12. Feedback Modal (după marcare ca gătit)

```
┌──────────────────────────────────┐
│     Cum a fost rețeta?           │
├──────────────────────────────────┤
│                                  │
│  A fost ok?                      │
│  [😊 Da, bună]                   │
│                                  │
│  Sau ai avut probleme?           │
│  [Alege problemă ▼]              │
│  • Timpul prea scurt             │
│  • Instrucțiuni neclare          │
│  • Ingrediente lipsă             │
│  • Porții incorecte              │
│                                  │
│  Alte observații:                │
│  [_________________________]    │
│                                  │
│  [Trimite] [Mai târziu]          │
└──────────────────────────────────┘
```

## FUNCȚIONALITĂȚI CHEIE PENTRU UX

### Critical UX Patterns:

**Mobile:**

- Glisare stânga/dreapta: Navighează între zile
- Pull-to-refresh: Sincronizează status completare
- Apasă pentru expandare: Arată rețeta completă inline
- Glisare dreapta: Marcare rapidă ca "gătit"
- Long press: Marcare ca "am deja" în listă

**Desktop:**

- Click meal cards: Expandare inline
- Hover states: Preview detalii rețete
- Drag-and-drop: Nu se aplică pentru utilizatori
- Keyboard shortcuts: Navigație rapidă

**Ambele:**

- Feedback vizual la marcare ca gătit (animație checkmark)
- Scroll lin între categorii cu header-uri sticky
- Auto-save indicatori vizuali
- Interface exclusiv în română pentru utilizatori

### Aspecte Tehnice de Implementare:

1. **Responsive Design**: Mobile-first cu viewport adaptiv
2. **Offline Support**: Cache pentru rețete și liste
3. **PWA Ready**: Instalabil ca aplicație nativă
4. **Performance**: Lazy loading pentru imagini rețete
5. **Accessibility**: ARIA labels pentru screen readers
6. **Romanian Localization**: Toate textele în română
