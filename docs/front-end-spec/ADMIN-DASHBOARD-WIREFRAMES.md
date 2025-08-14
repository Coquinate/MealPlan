# Admin Dashboard Wireframes

_Consolidated wireframes for all admin dashboard functionality_

## 🎯 Overview

**Target User:** Admin operators managing recipe content and meal plan creation  
**Platform:** Desktop-first design with optional tablet support  
**Authentication:** 2FA required (Story 3.1)  
**Core Philosophy:** Professional dashboard optimized for content creation efficiency

---

## 🏠 Main Dashboard & Navigation

### Dashboard Home

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Coquinate Admin                    🔔 Notificații    ⚙️ Settings    👤 Admin      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ◀ Dashboard │ Rețete │ Planuri │ Validare │ Analytics │ Urgențe │ AI Assistant     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│ ⚠️ ATENȚIE: Săptămâna curentă (22-28 Ian) nu este publicată!          [Publică Acum] │
│                                                                                        │
├─────────────────────────────┬──────────────────────────┬─────────────────────────────┤
│ SĂPTĂMÂNA CURENTĂ          │ PROGRES VALIDARE         │ STATISTICI RAPIDE          │
│ ┌─────────────────────────┐ │ ┌──────────────────────┐ │ ┌─────────────────────────┐ │
│ │ 22-28 Ianuarie 2025     │ │ │ Omnivore: ████░░ 80% │ │ │ 📊 Users activi: 247   │ │
│ │ Status: ⚠️ Draft        │ │ │ Vegetarian: ██░░░░ 40%│ │ │ 🍽️ Rețete active: 156  │ │
│ │ Omnivore: 28/28 meals  │ │ │                      │ │ │ ⭐ Rating mediu: 4.7   │ │
│ │ Vegetarian: 24/28 meals│ │ │ Issues: 3 warnings   │ │ │ 🛒 Export PDF: 1,247   │ │
│ │ [Editează Plan]        │ │ │ [Vezi Detalii]       │ │ │ [Dashboard Complet]    │ │
│ └─────────────────────────┘ │ └──────────────────────┘ │ └─────────────────────────┘ │
├─────────────────────────────┼──────────────────────────┼─────────────────────────────┤
│ ACȚIUNI RAPIDE             │ PLANURI VIITOARE         │ RECENT ACTIVITY             │
│ [+ Rețetă Nouă]            │ 29 Ian-4 Feb: ✓ Ready   │ • Recipe updated: Paprikash │
│ [🎯 Test Rețetă]           │ 5-11 Feb: 📝 In Progress│ • Plan published: 15-21 Ian│
│ [🤖 AI Generator]          │ 12-18 Feb: ⏳ Not Started│ • Validation passed: Week 3 │
│ [📊 Analytics]             │ [Vezi Calendar]          │ [Vezi Tot]                  │
└─────────────────────────────┴──────────────────────────┴─────────────────────────────┘
```

---

## 📝 Recipe Management Interface

### Recipe Library View

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Coquinate Admin → Rețete                                              👤 Admin    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Caută rețete...                 📁 Toate     📊 Status: Published ▼   [+ Nouă]     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Găsite: 156 rețete                                            Sort: Nume A-Z ▼        │
├────┬─────────────────────────────────┬───────────┬─────────┬─────────┬─────────┬──────┤
│    │ Numele Rețetei                  │ Categorie │ Status  │ Rating  │ Folosit │ Edit │
├────┼─────────────────────────────────┼───────────┼─────────┼─────────┼─────────┼──────┤
│ 🍖 │ Paprikash cu Pui                │ Cină      │ ✅ Live │ ⭐⭐⭐⭐⭐│ 23x     │ [📝] │
│ 🥗 │ Salată de Roșii cu Castraveți  │ Prânz     │ ✅ Live │ ⭐⭐⭐⭐   │ 45x     │ [📝] │
│ 🍝 │ Paste Carbonara (Românești)    │ Cină      │ 📝 Draft│ -       │ 0x      │ [📝] │
│ 🥞 │ Clătite cu Dulceață             │ Mic Dej   │ ✅ Live │ ⭐⭐⭐⭐⭐│ 67x     │ [📝] │
│ 🍲 │ Ciorbă de Burtă (Tradițională) │ Prânz     │ 🧪 Test │ ⭐⭐⭐    │ 2x      │ [📝] │
├────┴─────────────────────────────────┴───────────┴─────────┴─────────┴─────────┴──────┤
│ [◀ Prev] Page 1 of 6 [Next ▶]              [Import Rețete] [Export Lista] [Bulk Edit]│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Recipe Creation/Edit Form

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Admin → Rețete → Editare: Paprikash cu Pui                           [Salvează]   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Înapoi la Listă]                Status: Published ▼    [🧪 Mod Test] [🤖 AI Help] │
├─────────────────────────┬────────────────────────────────────────────────────────────┤
│ DETALII REȚETĂ         │ PREVIEW                                                    │
│                        │ ┌────────────────────────────────────────────────────┐  │
│ Nume (RO):             │ │ [════ Recipe Image Placeholder ════]               │  │
│ [Paprikash cu Pui   ]  │ │                                                    │  │
│                        │ │ PAPRIKASH CU PUI                                   │  │
│ Nume (EN):             │ │ ⏱️ 30 min    👥 4 persoane    🔥 Mediu              │  │
│ [Chicken Paprikash  ]  │ │                                                    │  │
│                        │ │ O rețetă tradițională ungurească adaptată...      │  │
│ Descriere (RO):        │ │                                                    │  │
│ [Tradițională...]      │ │ INGREDIENTE:                                       │  │
│                        │ │ • 500g piept de pui                                │  │
│ Timpul de gătit:       │ │ • 2 cepe mari                                     │  │
│ [30] minute            │ │ • 3 linguri paprika dulce                         │  │
│                        │ │                                                    │  │
│ Timpul activ:          │ └────────────────────────────────────────────────────┘  │
│ [25] minute (FR15)     │                                                        │
│                        │ [👁️ Preview Complet] [📱 Mobile View] [🖨️ Print Test] │
│ Dificultate:           │                                                        │
│ ●●●○○ Mediu            │                                                        │
│                        │                                                        │
│ [📸 Upload Imagine]    │                                                        │
└─────────────────────────┴────────────────────────────────────────────────────────────┤
│ INGREDIENTE                                                                          │
│ ┌─────────────────────┬──────────┬─────────┬─────────────────┬──────────────────────┐ │
│ │ Ingredient          │ Cantitate│ Unitate │ Note            │ Acțiuni              │ │
│ ├─────────────────────┼──────────┼─────────┼─────────────────┼──────────────────────┤ │
│ │ 🔍 Piept de pui     │ 500      │ g       │ fără piele      │ [🗑️] [📊 Nutriție]  │ │
│ │ 🔍 Ceapă            │ 2        │ buc     │ mari            │ [🗑️] [📊 Nutriție]  │ │
│ │ 🔍 Paprika dulce    │ 3        │ ling    │ originală       │ [🗑️] [📊 Nutriție]  │ │
│ └─────────────────────┴──────────┴─────────┴─────────────────┴──────────────────────┘ │
│ [+ Adaugă Ingredient] [📥 Import OpenFoodFacts] [🧮 Calculator Auto]                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ INSTRUCȚIUNI (RO)                          │ INSTRUCȚIUNI (EN)                      │
│ ┌─────────────────────────────────────────┐│┌─────────────────────────────────────────┐│
│ │ 1. Tăiați carnea în bucăți mici...     ││││ 1. Cut the meat into small pieces...   ││
│ │                                         ││││                                         ││
│ │ 2. Încălziți uleiul într-o tigaie...   ││││ 2. Heat oil in a large pan...          ││
│ │                                         ││││                                         ││
│ │ [Editor bogat cu formatare]             ││││ [Rich text editor]                     ││
│ │                                         ││││                                         ││
│ └─────────────────────────────────────────┘││└─────────────────────────────────────────┘│
├─────────────────────────────────────────────┴┴──────────────────────────────────────────┤
│ [🔍 Spell Check] [🤖 AI Improve] [💾 Save Draft] [✅ Mark Ready] [🧪 Start Test Mode] │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### OpenFoodFacts Integration

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Căutare Ingrediente - OpenFoodFacts Integration                        [Închide ✕]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Caută: [piept de pui____________] [Caută] [Cod Bare] [Adaugă Manual]             │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Rezultate găsite (23):                                                                │
│                                                                                        │
│ ┌─────┬─────────────────────────────┬─────────────────────────────┬─────────────────┐ │
│ │ IMG │ Nume                        │ Informații Nutriționale    │ Acțiuni         │ │
│ ├─────┼─────────────────────────────┼─────────────────────────────┼─────────────────┤ │
│ │ 📦  │ Piept de pui (fără piele)   │ 165 kcal/100g              │ [Selectează]    │ │
│ │     │ Marca: Avicola              │ Proteine: 31g               │ [Preview]       │ │
│ │     │ Cod: 1234567890123         │ Grăsimi: 3.6g              │                 │ │
│ ├─────┼─────────────────────────────┼─────────────────────────────┼─────────────────┤ │
│ │ 📦  │ Piept de pui organic        │ 172 kcal/100g              │ [Selectează]    │ │
│ │     │ Marca: Bio Farm             │ Proteine: 32g               │ [Preview]       │ │
│ │     │ Cod: 2345678901234         │ Grăsimi: 4.1g              │                 │ │
│ └─────┴─────────────────────────────┴─────────────────────────────┴─────────────────┘ │
│                                                                                        │
│ [◀ Prev] Page 1 of 3 [Next ▶]                                                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ INGREDIENT SELECTAT: Piept de pui (fără piele)                                       │
│ ┌────────────────────────────────────────────────────────────────────────────────┐   │
│ │ Informații Nutriționale per 100g:                                             │   │
│ │ • Calorii: 165 kcal     • Proteine: 31g    • Carbohidrați: 0g                │   │
│ │ • Grăsimi: 3.6g         • Fibre: 0g        • Zahăr: 0g                       │   │
│ │ • Sare: 0.1g            • Saturated: 1.1g   • Vitamina B6: 0.5mg             │   │
│ └────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
│ Cantitate pentru rețetă: [500] g                                                      │
│ Calculat automat: 825 kcal, 155g proteine pentru această rețetă                      │
│                                                                                        │
│ [Adaugă în Rețetă] [Salvează în Baza Locală] [Anulează]                             │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Meal Plan Builder Interface

### Visual Meal Plan Builder

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Admin → Planuri → Săptămâna 22-28 Ianuarie 2025                        [Salvează]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Lista Planuri] Omnivore ● | ○ Vegetarian    [Dublează Plan] [🤖 AI Assist] [?]   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ STATUS: 📝 Draft | Validat: ⚠️ 3 warnings | Modified: Azi 14:23                      │
├────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│        │   JOI    │   VIN    │   SÂM    │   DUM    │   LUN    │   MAR    │   MIE    │
│        │    22    │    23    │    24    │    25    │    26    │    27    │    28    │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ MIC    │[Ovăz cu  ]│[Omletă   ]│[Clătite  ]│[Iaurt   ]│[Ovăz    ]│[Pâine   ]│[Omletă  ]│
│ DEJ    │[Fructe   ]│[Spanac   ]│[Dulceață]│[Granola  ]│[Banană  ]│[Avocado ]│[Ciuperci]│
│ 5-15min│    10m    │    12m    │    20m    │     5m   │    5m    │    8m    │    15m   │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ PRÂNZ  │[Salată   ]│[Wrap     ]│[Pizza    ]│[↩️Rest  ]│[Supă    ]│[↩️Rest  ]│[Salată  ]│
│        │[Ton      ]│[Pui      ]│[Casei    ]│[Pizza   ]│[Legume   ]│[Supă    ]│[Verde   ]│
│10-30min│    15m    │    20m    │    90m    │    →5m   │    35m   │    →5m   │    12m   │
│        │           │           │  🔄BATCH  │  ↗━━━━━━━┫          │  ↗━━━━━━━┫          │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ CINĂ   │[Pui      ]│[Pește    ]│[↩️Rest  ]│[Tocană   ]│[Paste    ]│[↩️Rest  ]│[Grătar  ]│
│        │[Paprikash]│[Copt     ]│[Tocană  ]│[Vită     ]│[Carbonara]│[Tocană  ]│[Mici    ]│
│15-45min│    30m    │    25m    │    →10m  │    45m   │    25m   │    →8m   │    40m   │
│        │           │           │  ↗━━━━━━━┫  🔄BATCH │          │  ↗━━━━━━━┫          │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ GUSTARE│[Mere     ]│[Nuci     ]│[Iaurt    ]│[Banane   ]│[Mere    ]│[Nuci    ]│[Iaurt   ]│
│ 0-5min │     -     │     -     │     -    │     -    │     -    │     -    │     -    │
├────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┤
│ ⚠️ VALIDATION WARNINGS:                                                              │
│ • Duminică: Tocană prea complexă pentru weekend (>30min active cooking)             │
│ • Luni-Marți: Missing protein variety (pui 2 zile consecutive)                      │
│ • Vegetarian plan: Paste Carbonara needs vegetarian alternative                     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 📊 REZUMAT: 28/28 meals │ Batch cooking: 2 chains │ [🧮 Calculator Shopping List]   │
│ 🕒 Timp mediu: 18min/meal │ Weekday dinners: ✅ <30min │ [✅ Validează Plan]          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Drag & Drop Recipe Assignment

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Plan Builder → Assign Recipes                                    [Salvează] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Săptămâna: 22-28 Ian | JOI PRÂNZ | Înlocuiește: "Salată Ton"             [Anulează] │
├─────────────────────────────────┬────────────────────────────────────────────────────┤
│ RECIPES DISPONIBILE             │ MEAL SLOT: JOI PRÂNZ                              │
│ 🔍 Filter: [Prânz ▼] [<30min ▼] │                                                   │
│                                 │ ┌──────────────────────────────────────────────┐ │
│ Găsite: 23 rețete               │ │ [Drag recipe here]                           │ │
│                                 │ │                                              │ │
│ ┌─────────────────────────────┐ │ │ Current: Salată Ton                         │ │
│ │ 🥗 Salată Caesar            │ │ │ Time: 15min                                  │ │
│ │ ⏱️ 12min | ⭐⭐⭐⭐⭐         │ │ │ Serves: 4 people                            │ │
│ │ Used: Never | [DRAG HERE]   │ │ │                                              │ │
│ └─────────────────────────────┘ │ │ [Remove Current] [Quick Edit]                │ │
│                                 │ └──────────────────────────────────────────────┘ │
│ ┌─────────────────────────────┐ │                                                   │
│ │ 🥙 Wrap cu Pui              │ │ CONECTIVITĂȚI:                                    │
│ │ ⏱️ 18min | ⭐⭐⭐⭐           │ │ • Poate folosi resturile de la Miercuri Cină     │
│ │ Used: 3x | [DRAG HERE]      │ │ • Nu se potrivește cu planul Vegetarian          │
│ └─────────────────────────────┘ │ • Compatible cu restricțiile de timp            │
│                                 │                                                   │
│ ┌─────────────────────────────┐ │ VALIDĂRI AUTOMATE:                               │
│ │ 🍝 Paste Primavera          │ │ ✅ Sub 30 minute weekday                         │
│ │ ⏱️ 25min | ⭐⭐⭐⭐⭐         │ │ ✅ Potrivit pentru 4 persoane                    │
│ │ Used: 1x | [DRAG HERE]      │ │ ⚠️ Same protein as Tuesday                       │
│ └─────────────────────────────┘ │ ✅ Ingrediente disponibile                      │
│                                 │                                                   │
│ [+ Rețetă Nouă] [🤖 AI Suggest] │ [Salvează & Validează] [Preview Week]           │
└─────────────────────────────────┴────────────────────────────────────────────────────┘
```

### Leftover Flow Visual Editor

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🔄 Leftover Flow Designer → Săptămâna 22-28 Ian                          [Salvează] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Back to Plan] Mode: Visual Flow ● | ○ List View    [🤖 AI Optimize] [Validează]  │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ BATCH COOKING CHAINS:                                                                │
│                                                                                      │
│ Chain 1: Pizza → Pizza Rests                                                       │
│ ┌─────────────┐     ┌─────────────┐                                               │
│ │ SÂM PRÂNZ   │────▶│ DUM PRÂNZ   │                                               │
│ │ Pizza Casei │     │ Rest Pizza  │                                               │
│ │ 90min       │     │ 5min reheat │                                               │
│ │ [Edit]      │     │ [Edit]      │                                               │
│ └─────────────┘     └─────────────┘                                               │
│                                                                                      │
│ Chain 2: Tocană → Multi-use Leftovers                                              │
│ ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                          │
│ │ DUM CINĂ    │────▶│ MAR PRÂNZ   │────▶│ MAR CINĂ    │                          │
│ │ Tocană Vită │     │ Rest Tocană │     │ Rest Tocană │                          │
│ │ 45min BATCH │     │ 5min        │     │ 8min        │                          │
│ │ [Edit]      │     │ [Edit]      │     │ [Edit]      │                          │
│ └─────────────┘     └─────────────┘     └─────────────┘                          │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CREATE NEW CONNECTION:                                                               │
│ Source Meal: [Selectează meal ▼]    Target Meal: [Selectează meal ▼]               │
│ Connection Type: [Leftover ▼] | [Batch Cooking] | [Ingredient Reuse]               │
│                                                                                      │
│ [+ Add Connection] [Delete Selected] [Optimize All Chains]                          │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDATION RESULTS:                                                                  │
│ ✅ All connections valid                                                            │
│ ✅ No circular dependencies                                                         │
│ ⚠️ Chain 2 might be too long (3 meals from same source)                           │
│ 💡 Suggestion: Add more batch cooking opportunities on Monday                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Validation Dashboard

### AI Validation Overview

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🧠 AI Validation Dashboard → Săptămâna 22-28 Ianuarie 2025                    [Re-run]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Back to Plans] Status: ⚠️ Issues Found | Last check: Azi 15:30           [Export] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ OVERALL SCORE: 85/100 ████████▓▓                                                    │
│                                                                                      │
│ ┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────┐│
│ │ 🍎 NUTRITION        │ ⏰ COOKING TIME     │ 🔄 LEFTOVER LOGIC   │ 🛒 INGREDIENTS  ││
│ │ Score: 90/100       │ Score: 75/100       │ Score: 88/100       │ Score: 92/100   ││
│ │ ████████▓▓          │ ███████▓▓▓          │ ████████▓▓          │ █████████▓      ││
│ │                     │                     │                     │                 ││
│ │ ✅ Balanced macros  │ ⚠️ 2 meals >30min   │ ✅ Logical flow     │ ✅ All available││
│ │ ✅ Variety achieved │ ⚠️ Weekend too easy │ ⚠️ 1 chain too long│ ✅ Cost optimized││
│ │ ⚠️ Low fiber Tue    │ ✅ Batch optimized  │ ✅ No waste        │ ⚠️ 3 specialty  ││
│ │                     │                     │                     │                 ││
│ │ [Details ▼]         │ [Details ▼]         │ [Details ▼]         │ [Details ▼]     ││
│ └─────────────────────┴─────────────────────┴─────────────────────┴─────────────────┘│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 🔴 CRITICAL ISSUES (Must Fix Before Publishing):                                    │
│ • None found ✅                                                                     │
│                                                                                      │
│ ⚠️ WARNINGS (Recommended to Fix):                                                   │
│ • DUM CINĂ: Tocană Vită (45min) exceeds weekend cooking preference                  │
│   Fix: Replace with simpler 20-30min recipe | [Auto-fix] [Ignore]                  │
│                                                                                      │
│ • MAR+MIE: Repetitive protein (pui both days)                                      │
│   Fix: Replace Tuesday with fish or vegetarian | [Auto-fix] [Ignore]               │
│                                                                                      │
│ • MAR CINĂ: Leftover chain extends to 3rd meal (quality concern)                   │
│   Fix: Break chain or add fresh ingredients | [Auto-fix] [Ignore]                  │
│                                                                                      │
│ 💡 SUGGESTIONS (Optional Improvements):                                             │
│ • Add more fiber-rich ingredients on Tuesday                                        │
│ • Consider batch cooking opportunity on Monday                                      │
│ • 3 specialty ingredients might increase shopping complexity                        │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ AI ANALYSIS POWERED BY: Gemini 2.0 Flash | Processing time: 2.3s                   │
│ [🤖 Get Suggestions] [Auto-fix All Warnings] [Mark as Reviewed] [Force Publish]    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Validation Results

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🧠 AI Validation → Detailed Report: NUTRITION ANALYSIS                        [Back] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKLY NUTRITION BREAKDOWN (per person, averaged):                                  │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Daily Averages:                                                                 │ │
│ │ 📊 Calories: 2,150 kcal (Target: 2,000-2,200) ✅                              │ │
│ │ 🥩 Protein: 95g (Target: 80-120g) ✅                                           │ │
│ │ 🍞 Carbs: 245g (Target: 200-300g) ✅                                           │ │
│ │ 🥑 Fats: 82g (Target: 60-90g) ✅                                               │ │
│ │ 🌾 Fiber: 22g (Target: 25-35g) ⚠️ LOW                                         │ │
│ │ 🧂 Sodium: 2,850mg (Target: <2,300mg) ⚠️ HIGH                                │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ DAILY BREAKDOWN:                                                                     │
│ ┌────┬─────────┬─────────┬──────────┬──────────┬──────────┬─────────┬──────────┐   │
│ │Day │ Calories│ Protein │ Carbs    │ Fats     │ Fiber    │ Status  │ Issues   │   │
│ ├────┼─────────┼─────────┼──────────┼──────────┼──────────┼─────────┼──────────┤   │
│ │JOI │ 2,180   │ 98g     │ 250g     │ 85g      │ 24g      │ ✅ Good │ None     │   │
│ │VIN │ 2,095   │ 89g     │ 235g     │ 79g      │ 26g      │ ✅ Good │ None     │   │
│ │SÂM │ 2,340   │ 110g    │ 280g     │ 92g      │ 28g      │ ⚠️ High │ Calories │   │
│ │DUM │ 2,220   │ 105g    │ 260g     │ 88g      │ 25g      │ ✅ Good │ None     │   │
│ │LUN │ 2,050   │ 85g     │ 225g     │ 75g      │ 20g      │ ⚠️ Low  │ Fiber    │   │
│ │MAR │ 2,080   │ 92g     │ 240g     │ 78g      │ 18g      │ ⚠️ Low  │ Fiber    │   │
│ │MIE │ 2,180   │ 96g     │ 245g     │ 82g      │ 23g      │ ✅ Good │ None     │   │
│ └────┴─────────┴─────────┴──────────┴──────────┴──────────┴─────────┴──────────┘   │
│                                                                                      │
│ 🎯 RECOMMENDATIONS:                                                                 │
│ • Luni & Marți: Add fiber-rich sides (salad, whole grains, vegetables)             │
│ • Sâmbătă: Consider smaller portions or lighter snacks                              │
│ • Overall: Reduce sodium in marinades and sauces                                   │
│                                                                                      │
│ [📊 Export Nutrition Chart] [🔄 Rebalance Automatically] [❌ Mark as Acceptable]   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Recipe Testing Mode

### Test Management Interface

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🧪 Recipe Testing Mode → Active Tests                                        [New Test]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Back to Recipes] Filter: All ▼ | Status: Active ▼ | Tester: All ▼       [Export] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE TESTS (5):                                                                   │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🧪 TEST #247: Ciorbă de Burtă Tradițională                     Status: In Progress│ │
│ │ Started: 15 Jan 2025 | Tester: Maria Admin | Due: 18 Jan 2025                   │ │
│ │                                                                                   │ │
│ │ Test Results (2/3 completed):                                                    │ │
│ │ • Cooking Time: ✅ 45min (estimated 50min) - ACCURATE                           │ │
│ │ • Taste Test: ✅ 4.5/5 stars - EXCELLENT                                        │ │
│ │ • Instructions: ⏳ Pending - waiting for final test                              │ │
│ │                                                                                   │ │
│ │ Notes: "Timpul de gătit este perfect. Gustul autentic. Instrucțiunea 3 unclear."│ │
│ │ [Continue Test] [View Details] [Mark Complete]                                   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🧪 TEST #246: Paste Carbonara Românești                       Status: ⚠️ Issues  │ │
│ │ Started: 12 Jan 2025 | Tester: Ion Admin | Due: 15 Jan 2025 | OVERDUE!         │ │
│ │                                                                                   │ │
│ │ Issues Found:                                                                     │ │
│ │ • Cooking time: 35min actual vs 25min estimated (+10min error)                  │ │
│ │ • Ingredient quantity: Needs more parmesan (150g → 200g)                        │ │
│ │ • Missing step: Add pasta water before eggs                                      │ │
│ │                                                                                   │ │
│ │ Status: Needs revision before publishing                                          │ │
│ │ [Fix Issues] [Reassign Test] [Archive Recipe]                                   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ COMPLETED TESTS (Last 30 days): 23 ✅ | 4 ⚠️ | 1 ❌                                │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [Create New Test] [Bulk Assign] [Testing Guidelines] [Performance Report]           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Individual Test Execution

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🧪 Recipe Test → #247: Ciorbă de Burtă Tradițională              [Save Progress]    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Back to Tests] Tester: Maria Admin | Started: 15 Jan | Due: 18 Jan        [Help] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ RECIPE UNDER TEST:                                  │ TEST CHECKLIST:                │
│ ┌─────────────────────────────────────────────────┐ │ ┌───────────────────────────┐  │
│ │ CIORBĂ DE BURTĂ TRADIȚIONALĂ                    │ │ │ 1. ✅ INGREDIENT CHECK    │  │
│ │ Estimated: 50 minutes | 4 servings              │ │ │ • All available locally   │  │
│ │                                                 │ │ │ • Quantities accurate    │  │
│ │ INGREDIENTE:                                    │ │ │ • Clear measurements      │  │
│ │ • 500g burtă de vită                           │ │ └───────────────────────────┘  │
│ │ • 2 morcovi                                     │ │                                │
│ │ • 3 linguri smântână                           │ │ ┌───────────────────────────┐  │
│ │ • 2 căței de usturoi                           │ │ │ 2. ⏰ COOKING TIME TEST   │  │
│ │ • Sare, piper                                  │ │ │ Est: 50min | Actual: ____ │  │
│ │                                                 │ │ │ Start: 14:30              │  │
│ │ INSTRUCȚIUNI:                                   │ │ │ [Start Timer] [Stop]      │  │
│ │ 1. Spălați burta și fierbeți 30 minute...     │ │ └───────────────────────────┘  │
│ │ 2. Tăiați morcovii în cubulețe...             │ │                                │
│ │ [Vezi tot...]                                   │ │ ┌───────────────────────────┐  │
│ └─────────────────────────────────────────────────┘ │ │ 3. 👅 TASTE TEST         │  │
│                                                     │ │ Rating: ☆☆☆☆☆              │  │
│ REAL-TIME NOTES:                                    │ │ [Rate Now] [Skip]         │  │
│ ┌─────────────────────────────────────────────────┐ │ └───────────────────────────┘  │
│ │ 14:30 - Started prep. Burta looks fresh.       │ │                                │
│ │ 14:45 - First boil complete. Water very dirty! │ │ ┌───────────────────────────┐  │
│ │ 15:10 - Added vegetables. Smells authentic.    │ │ │ 4. 📝 INSTRUCTIONS        │  │
│ │ 15:25 - Added smântână. Color perfect.         │ │ │ Clear? Yes ○ No ○         │  │
│ │ [Add note...]                                   │ │ │ Missing steps? ________   │  │
│ │                                                 │ │ │ [Complete Assessment]     │  │
│ └─────────────────────────────────────────────────┘ │ └───────────────────────────┘  │
├─────────────────────────────────────────────────────┼────────────────────────────────┤
│ PHOTOS:                                             │ ISSUES FOUND:                  │
│ [📸 Upload Before] [📸 Upload During] [📸 Final]    │ • Step 2 unclear about size   │
│                                                     │ • Need pasta water reminder   │
│ FINAL VERDICT:                                      │ [Add Issue] [Resolve]         │
│ ○ Approve for Publishing  ○ Needs Minor Changes     │                                │
│ ○ Needs Major Revision   ○ Reject Recipe           │ [Complete Test] [Save & Exit] │
└─────────────────────────────────────────────────────┴────────────────────────────────┘
```

---

## 📊 Analytics & Emergency Operations

### Admin Analytics Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📊 Analytics Dashboard → Last 30 Days                                         [Export]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Dashboard] Period: Last 30 Days ▼ | Compare: Previous Period ☑           [Refresh]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ KEY METRICS:                                                                         │
│ ┌───────────────────┬───────────────────┬───────────────────┬──────────────────────┐ │
│ │ 👥 ACTIVE USERS   │ 🍽️ MEAL COMPLETIONS │ ⭐ AVG RATING    │ 📱 APP USAGE       │ │
│ │ 247 (+12%)       │ 89.2% (+2.1%)     │ 4.7/5 (+0.1)    │ 3.2 days/week      │ │
│ │ ████████░░        │ █████████░        │ █████████░       │ ███████░░░          │ │
│ │ Target: 300       │ Target: 85%       │ Target: 4.5      │ Target: 4 days      │ │
│ └───────────────────┴───────────────────┴───────────────────┴──────────────────────┘ │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📈 USER ENGAGEMENT (Daily Active Users)                                        │ │
│ │ 300│ ░░██░░██░░███░░██░░████░░███░░██░░███░░██████░░███░░██░░                    │ │
│ │ 250│ ░░██░░██░░███░░██░░████░░███░░██░░███░░██████░░███░░██░░                    │ │
│ │ 200│ ██████████████████████████████████████████████████████                    │ │
│ │ 150│ ██████████████████████████████████████████████████████                    │ │
│ │ 100│ ██████████████████████████████████████████████████████                    │ │
│ │  50│ ██████████████████████████████████████████████████████                    │ │
│ │   0└────────────────────────────────────────────────────────                   │ │
│ │      1  3  5  7  9 11 13 15 17 19 21 23 25 27 29 31                          │ │
│ │    Peak: 278 users on Jan 15 (Sunday) - Recipe planning day                    │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ RECIPE PERFORMANCE (Top 10):                                                        │
│ ┌────────────────────────────────┬─────────┬─────────┬─────────┬─────────────────┐ │
│ │ Recipe                         │ Usage   │ Rating  │ Complete│ Issues          │ │
│ ├────────────────────────────────┼─────────┼─────────┼─────────┼─────────────────┤ │
│ │ 🍖 Paprikash cu Pui            │ 89x     │ ⭐⭐⭐⭐⭐ │ 92%     │ None            │ │
│ │ 🥗 Salată Română cu Telemea    │ 76x     │ ⭐⭐⭐⭐   │ 88%     │ None            │ │
│ │ 🍲 Ciorbă de Legume            │ 65x     │ ⭐⭐⭐⭐⭐ │ 85%     │ None            │ │
│ │ 🍝 Paste cu Sos de Roșii       │ 58x     │ ⭐⭐⭐⭐   │ 79%     │ 2 complaints    │ │
│ │ 🥞 Clătite cu Dulceață         │ 45x     │ ⭐⭐⭐⭐⭐ │ 94%     │ None            │ │
│ └────────────────────────────────┴─────────┴─────────┴─────────┴─────────────────┘ │
│                                                                                      │
│ [Detailed Reports] [Recipe Analysis] [User Feedback] [Export All Data]              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Emergency Operations Panel

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🚨 Emergency Operations Center                                              [Refresh] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Dashboard] Status: ✅ All Systems Operational | Last Update: Acum 2 minute      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CURRENT STATUS:                                                                      │
│ ┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────┐│
│ │ 🟢 SYSTEM HEALTH   │ 🟢 PUBLISHING       │ 🟢 USER ACCESS     │ 🟡 CONTENT     ││
│ │ All services up     │ Weekly plans ready  │ Login working       │ 1 recipe issue ││
│ │ Response: 145ms     │ Next: Tomorrow 6AM  │ 247 active users    │ Needs attention ││
│ │ [Monitor]           │ [Preview]           │ [User Admin]        │ [Fix Now]       ││
│ └─────────────────────┴─────────────────────┴─────────────────────┴─────────────────┘│
│                                                                                      │
│ EMERGENCY ACTIONS:                                                                   │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔥 CRITICAL ACTIONS (Use only in emergencies!)                                 │ │
│ │                                                                                 │ │
│ │ [🚨 Emergency Stop All Publishing] - Stops automated meal plan releases        │ │
│ │ [⚠️ Force Republish This Week] - Republishes current week's plan immediately   │ │
│ │ [🔄 Rollback to Previous Week] - Reverts to last known good meal plan         │ │
│ │ [📧 Send Emergency Email] - Notifies all users of system issues               │ │
│ │                                                                                 │ │
│ │ [⛔ CONFIRMATION REQUIRED] - All actions above require admin password          │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ ISSUE TRACKING:                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟡 ACTIVE ISSUE #001: Recipe timing discrepancy                                │ │
│ │ Reported: 2 hours ago | Severity: Medium | Affected: ~15 users                 │ │
│ │ Problem: "Paprikash cu Pui" showing 30min but users report 45min actual        │ │
│ │ Actions: [Update Recipe] [Notify Affected Users] [Mark Resolved]               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ AUTOMATED ALERTS:                                                                    │
│ • ✅ 06:00 - Weekly meal plan published successfully                                │
│ • ✅ 18:00 - Daily user notifications sent (247 recipients)                        │ │
│ • ⚠️ 14:23 - Recipe feedback spike detected (+15% negative ratings)               │
│ • 🟢 15:30 - System backup completed successfully                                  │
│                                                                                      │
│ [View All Alerts] [System Logs] [Backup Status] [Contact Tech Support]             │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Assistant Integration

### AI Assistant Interface (Admin Only)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🤖 AI Assistant → Gemini 2.0 Flash Integration                               [Settings]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [← Dashboard] Mode: Recipe Assistant ● | Plan Builder | Validator           [History] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CONVERSATION:                                                                        │
│                                                                                      │
│ 👤 Admin (15:34): Create a traditional Romanian soup recipe for winter, serves 4    │
│                                                                                      │
│ 🤖 AI (15:34): I'll create a Ciorbă de Fasole (Bean Soup) recipe for you:          │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🍲 CIORBĂ DE FASOLE TRADIȚIONALĂ                                               │ │
│ │                                                                                 │ │
│ │ ⏱️ 45 minutes | 👥 4 servings | 🔥 Easy                                       │ │
│ │                                                                                 │ │
│ │ INGREDIENTE:                                                                    │ │
│ │ • 300g fasole boabe (înmuiată peste noapte)                                   │ │
│ │ • 200g ciolan afumat                                                           │ │
│ │ • 2 cepe medii                                                                 │ │
│ │ • 3 morcovi                                                                     │ │
│ │ • 2 linguri pastă de tomate                                                    │ │
│ │ • Cimbru, dafin, sare, piper                                                  │ │
│ │                                                                                 │ │
│ │ INSTRUCȚIUNI:                                                                   │ │
│ │ 1. Fierbeți fasolea cu ciolanul 30 minute...                                  │ │
│ │ 2. Călește ceapa și morcovii...                                               │ │
│ │ [Vezi rețeta completă...]                                                       │ │
│ │                                                                                 │ │
│ │ [💾 Save to Recipes] [✏️ Edit Details] [🧪 Start Test] [🔄 Generate Another]   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ 👤 Admin (15:36): Make it vegetarian but keep the smoky flavor                      │
│                                                                                      │
│ 🤖 AI (15:36): I'll modify the recipe to be vegetarian with smoked paprika:        │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🥄 MODIFIED: Replace "ciolan afumat" with:                                      │ │
│ │ • 2 linguri paprika afumată                                                    │ │
│ │ • 1 lingură pastă de ardei iute                                               │ │
│ │ • 200ml bulion de legume (instead of meat broth)                               │ │
│ │                                                                                 │ │
│ │ This maintains the smoky flavor while being 100% vegetarian.                   │ │
│ │                                                                                 │ │
│ │ [Update Recipe] [Show Nutrition Info] [Compare Versions]                       │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 💬 Ask AI Assistant:                                                            │ │
│ │ [What other Romanian soups work for winter?_________________] [Send]            │ │
│ │                                                                                 │ │
│ │ Quick Prompts:                                                                  │ │
│ │ [Create leftover recipe] [Suggest meal plan] [Check nutrition] [Find substitute]│ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 🧠 AI CAPABILITIES:                                                                 │
│ ✅ Recipe creation from ingredients    ✅ Meal plan optimization                     │
│ ✅ Romanian cuisine adaptation         ✅ Nutritional analysis                       │
│ ✅ Leftover transformation recipes     ✅ Cooking time estimation                    │
│ ✅ Ingredient substitution             ✅ Batch cooking suggestions                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Responsiveness Notes

While the admin dashboard is **desktop-first**, key sections adapt for tablet use:

### Mobile/Tablet Navigation

```
┌─────────────────────────────┐
│ ☰ Menu  Coquinate Admin 👤 │
├─────────────────────────────┤
│ 📊 Dashboard                │
│ 🍽️ Rețete (156)            │
│ 📅 Planuri                 │
│ ✅ Validare (3 warnings)   │
│ 📈 Analytics               │
│ 🚨 Urgențe                 │
│ 🤖 AI Assistant            │
│ ⚙️ Settings                │
│ 🚪 Logout                  │
└─────────────────────────────┘
```

### Key Mobile Adaptations:

- Collapsible sidebar navigation
- Touch-friendly buttons (44px minimum)
- Swipe gestures for meal plan navigation
- Responsive data tables with horizontal scroll
- Modal forms for recipe editing on small screens

---

## 🎯 Success Metrics

- **Creation Speed:** Recipe creation <5 minutes average
- **Plan Efficiency:** Weekly meal plan built in <20 minutes
- **Error Rate:** <1% validation failures reach production
- **Test Coverage:** 100% recipes tested before publishing
- **Admin Satisfaction:** <3 clicks for common operations

---

_This consolidated wireframes document contains all admin dashboard interfaces across recipe management, meal planning, validation, testing, analytics, and emergency operations. The desktop-first design ensures optimal productivity for content creators while maintaining the Romanian market focus and family meal planning efficiency._
