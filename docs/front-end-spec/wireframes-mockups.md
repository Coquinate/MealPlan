# Wireframes & Mockups

## Design Files

**Primary Design Files:** Figma will be used for high-fidelity designs. Design work will be organized by User App (mobile-first) and Admin Dashboard (desktop-first).

## Key Screen Layouts

### Week View Dashboard

**Purpose:** Show weekly meal plan per FR1, default view per user preference

**Key Elements per PRD:**

- 7-day × 4-meal grid with visual meal cards
- Cooking time badges (<30min for weekday dinners per FR15)
- Leftover flow arrows between connected meals (FR2)
- Mark as cooked functionality (FR7)
- Today column highlighted
- Shopping list access button (FR6)

**Critical UX Patterns:**

- **Mobile:** Horizontal swipe between days (standard mobile pattern users expect)
- **Desktop:** Click meal cards for inline expansion
- **Both:** Visual feedback on mark as cooked (checkmark animation)

**Design File Reference:** [To be created in Figma]

**ASCII Wireframe - Mobile:**

```
┌──────────────────────────────────┐
│ 🍽️ Coquinate          👤 Cont    │
├──────────────────────────────────┤
│ ⚡ {t('savings.time_saved_this_week', {hours: '3+'})}│
├──────────────────────────────────┤
│ ◄ 15-21 Ianuarie 2025 ►         │
│ [{t('navigation.view_last_week')}]             │
├──────────────────────────────────┤
│ L  M  Mi  J  V  S  D            │
│ 15 16 17★ 18 19 20 21           │
├──────────────────────────────────┤
│ [{t('instructions.swipe_for_other_days')} →→→]   │
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
│ {t('progress.week')}: ███░░░ 45% {t('time.week')}   │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

**ASCII Wireframe - Desktop:**

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Coquinate                                         ⚡3+ ore saved     👤 Profile   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                        ◄ {t('date.week')} 15-21 {t('date.january')} 2025 ►              [🛒 {t('tabs.shopping')}] │
├────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│        │   {t('days.mon')}    │   {t('days.tue')}    │  ★{t('days.wed')}★   │   {t('days.thu')}    │   {t('days.fri')}    │   {t('days.sat')}    │   {t('days.sun')}    │
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
│ {t('progress.week')}: ████████░░░░░░░░░░░░ 40% {t('status.complete')}     [📄 {t('actions.export_pdf')}]           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Today Focus View

**Purpose:** Focused view of today's 4 meals (FR32 - user selectable default)

**Key Elements per PRD:**

- Large cards for today's 4 meals
- Recipe details with portions scaled to household (FR5)
- Mark as cooked + thumbs up/down feedback (FR7)
- Tomorrow preview at bottom

**Critical UX Patterns:**

- **Swipe left/right:** Navigate between days (mobile standard)
- **Pull-to-refresh:** Sync completion status (mobile expectation)
- **Tap to expand:** Show full recipe inline

**Design File Reference:** [To be created in Figma]

**ASCII Wireframe - Today View:**

```
┌──────────────────────────────────┐
│ ⚠️ Perioada de test: Ziua 2 din 3│
├──────────────────────────────────┤
│ ◄ Miercuri, 17 Ianuarie         │
│    Pentru 4 persoane 👨‍👩‍👧‍👦         │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ {t('meals.breakfast')}        ✓ {t('status.cooked')}  │  │
│ │ ┌────┐                     │  │
│ │ │ 🍳 │ Omletă (8 ouă)      │  │
│ │ └────┘ 10 minute           │  │
│ │ [👍] [👎]  [Vezi Rețeta ▼] │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ {t('meals.lunch')}            ✓ {t('status.cooked')}  │  │
│ │ ┌────┐                     │  │
│ │ │ 🍝 │ Paste (500g)        │  │
│ │ └────┘ 25 minute           │  │
│ │ ⚠️ Din resturile de ieri    │  │
│ │ [👍] [👎]  [Vezi Rețeta ▼] │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ {t('meals.dinner')}             □ {t('status.not_cooked')} │  │
│ │ ┌────┐                     │  │
│ │ │ 🍗 │ Pui (1.5kg)         │  │
│ │ └────┘ 30 minute           │  │
│ │ [{t('actions.mark_as_cooked')}]       │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ {t('nutrition.today')} ({t('nutrition.total_per_person')})  │  │
│ │ Calorii: 2,150 kcal        │  │
│ │ Proteine: 95g │ Fibre: 28g │  │
│ │ Carbs: 245g │ Grăsimi: 82g │  │
│ └────────────────────────────┘  │
│                                  │
│ Mâine: Ciorbă, Salată... ►      │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

### Shopping List Interface

**Purpose:** Interactive weekly shopping list per FR6, FR12, FR28

**Key Elements per PRD:**

- Categorized ingredients (customizable per FR28)
- Search bar (FR6)
- Check-off circles (FR12)
- "Already have" marking (FR12)
- PDF export button (FR6)

**Critical UX Patterns:**

- **Swipe right:** Quick check-off item (faster than tapping)
- **Long press:** Mark as "already have"
- **Pull-to-refresh:** Ensure latest list if multiple devices
- **Smooth scroll:** Between categories with sticky headers

**Design File Reference:** [To be created in Figma]

**ASCII Wireframe - Shopping List:**

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
│ │ ○ {t('ingredients.cheese')} 500g         [⊖]  │  │
│ │ ○ {t('ingredients.cream')} 200ml      [⊖]  │  │
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
│ Progress: ████░░░░░░ 3/15 items │
├──────────────────────────────────┤
│ [Marchează toate ca „am deja"]  │
└──────────────────────────────────┘

Legend:
○ = Need to buy
✓ = Bought
⊖ = Already have
[+][-] = Expand/Collapse category
```

### Admin Meal Plan Builder

**Purpose:** Visual meal plan creation per FR11, FR17

**Key Elements per PRD:**

- 7×4 meal grid canvas
- Recipe sidebar with search/filter
- Drag-and-drop from sidebar to grid
- Visual leftover connections (FR17)
- Live shopping list preview (FR17)
- Validation status indicators (FR30)

**Critical UX Patterns:**

- **Drag-and-drop:** Primary interaction for recipe placement
- **Hover states:** Preview recipe details before dropping
- **Auto-save:** Visual indicator after each change
- **Undo/redo:** Standard keyboard shortcuts (Ctrl+Z/Y)

**Design File Reference:** [To be created in Figma]

**ASCII Wireframe - Admin Meal Plan Builder:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Meal Plans          [Clone Last] [Emergency Mode]    Status: ⚠️ Incomplete  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Type: [●Omnivore ○Veg]  Week: 22-28 Jan  Deadline: Wed 2 PM   [🧪 Test Recipes]      │
├─────────────────┬────────────────────────────────────────────────┬─────────────────────┤
│ RECIPE LIBRARY  │              MEAL PLAN GRID                    │ SHOPPING LIST LIVE │
│ ┌─────────────┐ ├────┬────┬────┬────┬────┬────┬────┬────┐      │ ┌─────────────────┐ │
│ │🔍 Search... │ │    │LUN │MAR │MIE │JOI │VIN │SÂM │DUM │      │ │ 23 items total  │ │
│ └─────────────┘ ├────┼────┼────┼────┼────┼────┼────┼────┤      │ ├─────────────────┤ │
│ □ Mic Dejun     │MIC │🥐  │DROP│🍳  │DROP│DROP│DROP│🍩  │      │ │ Lactate: 5      │ │
│ □ Prânz         │DEJ │15m │    │10m │    │    │    │10m │      │ │ Carne: 4        │ │
│ □ Cină          ├────┼────┼────┼────┼────┼────┼────┼────┤      │ │ Legume: 8       │ │
│ □ <30min        │PRÂ │🍲  │DROP│DROP│DROP│DROP│DROP│🍛  │      │ │ Paste/Orez: 3   │ │
│                 │NZ  │45m │    │    │    │    │    │2h! │      │ │ Altele: 3       │ │
│ ┌─────────────┐ │    │└───────────────────────────────┘│ │      │ ├─────────────────┤ │
│ │🍳 Omletă    │ ├────┼────┼────┼────┼────┼────┼────┼────┤      │ │ ⚠️ >40 items!    │ │
│ │⏱️ 15min     │ │CINĂ│DROP│DROP│DROP│DROP│DROP│DROP│DROP│      │ │                 │ │
│ │[DRAG]       │ │    │    │    │    │    │    │    │    │      │ │ [Optimize]      │ │
│ └─────────────┘ ├────┼────┼────┼────┼────┼────┼────┼────┤      │ └─────────────────┘ │
│ ┌─────────────┐ │SNAK│🍎  │DROP│DROP│DROP│DROP│DROP│🍪  │      │                     │
│ │🍲 Ciorbă    │ └────┴────┴────┴────┴────┴────┴────┴────┘      │ VALIDATION:         │
│ │⏱️ 45min     │                                                  │ ❌ 18 slots empty   │
│ │↩️ 3 days    │ [🤖 AI Fill Gaps] [👁️ Preview] [📤 Publish]     │ ⚠️ No batch Sunday  │
│ │[DRAG]       │                                                  │ ✅ Times realistic  │
│ └─────────────┘ │                                                  │                     │
└─────────────────┴────────────────────────────────────────────────┴─────────────────────┘
```

### Recipe Testing Mode

**Purpose:** Validate recipes before publishing per FR30 and Story 3.3

**Key Elements per PRD:**

- Device preview (mobile/desktop views)
- Household scaling test (1-6 people)
- Shopping list impact display
- Test checklist
- Pass/fail status

**Critical UX Patterns:**

- **Toggle:** Quick switch between device views
- **Responsive preview:** Real-time scaling adjustments
- **Checklist persistence:** Remember what's been tested

**Design File Reference:** [To be created in Figma]

**ASCII Wireframe - Recipe Testing Mode:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 🧪 Testare Rețetă: Omletă cu Brânză       [◄ Înapoi la Planuri de Mese]   │
├────────────────────────────────────────────────────────────────────────────┤
│ Status: ⚠️ Testare Necesară    ID Rețetă: R-127    [📤 Marchează Testat]   │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ LISTĂ VERIFICARE     │              MODURI PREVIZUALIZARE                  │
│                      │                                                     │
│ □ Previzualizare Mobil│ Dispozitiv: [📱Mobil] [💻Desktop] [📧PDF]         │
│ □ Previzualizare Desktop│                                                  │
│ □ Test Export PDF    │ Mărime Gospodărie: [1▼] [2] [3] [●4] [5] [6]      │
│ □ Scalare Porții     │                                                     │
│ □ Impact Listă Cumpărături│ ┌─────────────────────────────────────────────────┐ │
│ □ Timp Gătit Valid   │ │ Omletă cu Brânză                               │ │
│ □ Verificare Ingrediente│ │ ⏱️ 10 minute preparare                         │ │
│                      │ │                                                 │ │
│ REZULTATE VALIDARE:  │ │ Pentru 4 persoane:                             │ │
│ ✅ Rețeta se încarcă │ │ • 8 ouă mari                                   │ │
│ ✅ Imaginile se afișează│ │ • 200g brânză râsă                            │ │
│ ⚠️ Timpul pare scurt │ │ • 50ml lapte                                   │ │
│ ❌ Lipsește sare     │ │ • Sare, piper după gust                       │ │
│                      │ │                                                 │ │
│ NOTE:                │ │ Instrucțiuni:                                  │ │
│ ┌──────────────────┐ │ │ 1. Bateți ouăle cu laptele...                  │ │
│ │Timpul ar putea fi│ │ │ 2. Adăugați brânza...                         │ │
│ │prea scurt pentru │ │ │ 3. Încălziți tigaia...                         │ │
│ │8 ouă. Sugerez    │ │ │                                                 │ │
│ │12-15min în loc.  │ │ │                                                 │ │
│ └──────────────────┘ │ └─────────────────────────────────────────────────┘ │
└──────────────────────┴─────────────────────────────────────────────────────┘
[Rețete] [Planuri de Mese] [Testare] [Analiză]
```

### Account/Settings Screen

**Purpose:** User account management and preferences per FR4, FR27, FR19, FR32

**Key Elements per PRD:**

- Household size configuration (FR5)
- Menu type selection (FR4, FR27)
- Vacation mode toggle (FR19)
- Default page preference (FR32)
- Subscription management
- Historical meal data access

**Critical UX Patterns:**

- **Romanian interface:** All text in Romanian for user screens
- **Simple toggles:** Easy switching between preferences
- **Clear billing info:** Transparent subscription details

**ASCII Wireframe - Account Screen:**

```
┌──────────────────────────────────┐
│ ◄ Contul Meu                     │
├──────────────────────────────────┤
│ maria@example.com                │
├──────────────────────────────────┤
│ PREFERINȚE GOSPODĂRIE            │
│ ┌────────────────────────────┐  │
│ │ Număr persoane: [1-6 slider]│ │
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
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

## Additional Screen Wireframes

### Recipe Detail View

**Purpose:** Complete recipe information for cooking per Story 4.4

**Key Elements per PRD:**

- Full recipe with step-by-step instructions (FR9)
- Ingredient list with automatic portion scaling (FR5)
- Photo display, difficulty and time indicators
- Nutritional information display
- Print recipe option
- Back navigation to week/today view

**ASCII Wireframe - Recipe Detail:**

```
┌──────────────────────────────────┐
│ ◄ Omletă cu Brânză      [🖨️ Print]│
├──────────────────────────────────┤
│ ⏱️ 10 min │ 👥 Pentru 4 persoane │
│ 🍳 Ușor   │ 📊 250 cal/porție    │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │       [FOOD IMAGE]         │  │
│ │    Omletă cu brânză        │  │
│ └────────────────────────────┘  │
├──────────────────────────────────┤
│ INGREDIENTE (4 persoane):        │
│ • 8 ouă mari                     │
│ • 200g brânză râsă               │
│ • 50ml lapte                     │
│ • 2 linguri unt                  │
│ • Sare, piper după gust          │
│ • Pătrunjel proaspăt             │
├──────────────────────────────────┤
│ INFORMAȚII NUTRIȚIONALE/porție:  │
│ ┌────────────────────────────┐  │
│ │ Calorii: 250 kcal          │  │
│ │ Proteine: 18g              │  │
│ │ Carbohidrați: 3g           │  │
│ │ Grăsimi: 19g               │  │
│ │ Fibre: 0.5g                │  │
│ │ Sodiu: 420mg               │  │
│ └────────────────────────────┘  │
├──────────────────────────────────┤
│ INSTRUCȚIUNI:                    │
│ 1. Bateți ouăle cu laptele       │
│    într-un bol mare              │
│                                  │
│ 2. Adăugați brânza râsă și       │
│    condimentele                  │
│                                  │
│ 3. Încălziți tigaia la foc       │
│    mediu cu unt                  │
│                                  │
│ 4. Turnați amestecul și gătiți   │
│    3-4 minute până se închide    │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

### Feedback Modal

**Purpose:** Collect recipe improvement feedback per Story 4.6

**Key Elements per PRD:**

- Thumbs up/down after marking cooked (FR7)
- Predefined problem categories for recipe issues
- Optional comment field for detailed feedback
- Focus on recipe problems, not cooking execution

**ASCII Wireframe - Feedback Modal:**

```
┌──────────────────────────────────┐
│   ┌────────────────────────┐    │
│   │  ✅ Masa gătită!       │    │
│   │                        │    │
│   │  Omletă cu brânză      │    │
│   │                        │    │
│   │  [👍] Bună  [👎] Problemă│    │
│   │                        │    │
│   │  Ce problemă cu rețeta? │    │
│   │  ┌──────────────────┐  │    │
│   │  │ Timpul prea scurt▼│  │    │
│   │  └──────────────────┘  │    │
│   │  • Timpul prea scurt   │    │
│   │  • Instrucțiuni neclare│    │
│   │  • Ingrediente lipsă   │    │
│   │  • Prea complicat      │    │
│   │  • Porțiile greșite    │    │
│   │                        │    │
│   │  Detalii (opțional):   │    │
│   │  ┌──────────────────┐  │    │
│   │  │15 min ar fi fost  │  │    │
│   │  │mai realist        │  │    │
│   │  └──────────────────┘  │    │
│   │                        │    │
│   │    [Trimite]  [Skip]  │    │
│   └────────────────────────┘    │
└──────────────────────────────────┘
```

### Previous Week View

**Purpose:** Read-only reference to last week's meals per FR10

**Key Elements per PRD:**

- Previous week visible for 3 days as read-only reference
- Show completion status (cooked/skipped) with icons only
- No interactive elements, just historical reference
- Display progress statistics for completed week

**ASCII Wireframe - Previous Week (Read-Only):**

```
┌──────────────────────────────────┐
│ 🍽️ Coquinate          👤 Cont    │
├──────────────────────────────────┤
│ ⏪ Săptămâna trecută (read-only) │
├──────────────────────────────────┤
│ ◄ 8-14 Ian 2025 ►    [Înapoi]   │
│ Disponibil până pe 17 Ian        │
├──────────────────────────────────┤
│ L  M  Mi  J  V  S  D            │
│ 08 09 10 11 12 13 14           │
├──────────────────────────────────┤
│┌─────┬─────┬─────┬─────┐        │
││ LUN │ MAR │ MIE │ JOI │        │
│├─────┼─────┼─────┼─────┤        │
││ 🥐  │ 🥞  │ 🍳  │ 🥣  │ MIC    │
││ ✅  │ ✅  │ ❌  │ ✅  │ DEJ    │
│├─────┼─────┼─────┼─────┤        │
││ 🍲  │ 🥗  │ 🍝  │ 🍕  │ PRÂNZ  │
││ ✅  │ ✅  │ ✅  │ ❌  │        │
│├─────┼─────┼─────┼─────┤        │
││ 🍖  │ 🐟  │ 🍗  │ 🥩  │ CINĂ   │
││ ✅  │ ✅  │ ❌  │ ✅  │        │
│├─────┼─────┼─────┼─────┤        │
││ 🍎  │ 🥜  │ 🍌  │ 🥨  │ GUSTARE│
││ ✅  │ ✅  │ ✅  │ ❌  │        │
│└─────┴─────┴─────┴─────┘        │
│                                  │
│ Progres săptămâna: 79% gătit    │
│ ⏱️ Timp economisit: ~4 ore       │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘

Legend: ✅ gătit, ❌ sărit, 🔄 înlocuit
```

Note: Read-only means no interactions, just visual reference for 3 days per FR10

### Loading & Error States

**Purpose:** Handle system delays and failures gracefully per PRD requirements

**ASCII Wireframe - Loading Screen:**

```
┌──────────────────────────────────┐
│ 🍽️ Coquinate          👤 Cont    │
├──────────────────────────────────┤
│                                  │
│   ┌─────────────────────────┐   │
│   │     🍳 Pregătim          │   │
│   │     planul pentru tine...│   │
│   │                         │   │
│   │    ████████░░░░░░░░      │   │
│   │    Se încarcă...        │   │
│   └─────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

**ASCII Wireframe - Error Screen (Payment Failure):**

```
┌──────────────────────────────────┐
│ ⚠️ Problemă cu plata              │
├──────────────────────────────────┤
│                                  │
│ Nu am putut procesa plata.       │
│ Vom încerca din nou în 24h.     │
│                                  │
│ Încercare 2 din 3                │
│                                  │
│ [Încearcă din nou]               │
│ [Schimbă metoda de plată]        │
│                                  │
│ Ai acces la planul curent        │
│ până rezolvăm problema.          │
└──────────────────────────────────┘
```

Note: Per FR24 - 3 retry attempts over 7 days before suspension

### Onboarding Flow

**Purpose:** Streamlined 3-step registration process with direct access to trial menu (no tutorial screens)

**ASCII Wireframe - Step 1 (Registration):**

```
┌──────────────────────────────────┐
│ 🍽️ Bine ai venit la Coquinate!  │
├──────────────────────────────────┤
│ Pasul 1 din 3                   │
│ ████████░░░░░░░░░░░░░░░░░░░░░░    │
│                                  │
│ ┌────────────────────────────┐  │
│ │ Email: __________________ │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ Nume: ___________________ │  │
│ └────────────────────────────┘  │
│                                  │
│ [Continuă]                       │
│                                  │
│ ✨ Fără card necesar pentru     │
│    perioada de încercare        │
└──────────────────────────────────┘
```

**ASCII Wireframe - Step 2 (Household Size):**

```
┌──────────────────────────────────┐
│ 🍽️ Configurare                   │
├──────────────────────────────────┤
│ Pasul 2 din 3                   │
│ ████████████████░░░░░░░░░░░░░░░░    │
│                                  │
│ Pentru câte persoane gătești?   │
│                                  │
│ ┌─ [1] ─ [2] ─ [●3] ─ [4] ─ [5] ─ [6] ─┐
│ │                                      │
│ │        👨‍👩‍👧  3 persoane             │
│ └──────────────────────────────────────┘
│                                  │
│ [◄ Înapoi]         [Continuă ►] │
│                                  │
│ Poți schimba oricând din cont   │
└──────────────────────────────────┘
```

**ASCII Wireframe - Step 3 (Menu Type):**

```
┌──────────────────────────────────┐
│ 🍽️ Preferințe Meniu             │
├──────────────────────────────────┤
│ Pasul 3 din 3                   │
│ ████████████████████████████████    │
│                                  │
│ Ce fel de mâncăruri preferi?    │
│                                  │
│ ┌────────────────────────────┐  │
│ │ ●Omnivore                  │  │
│ │  (toate tipurile)          │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ ○Vegetariene               │  │
│ │  (fără carne/pește)        │  │
│ └────────────────────────────┘  │
│                                  │
│ [◄ Înapoi]         [Continuă ►] │
└──────────────────────────────────┘
```

**Post-Registration Behavior:**
After completing Step 3, users are immediately redirected to the Week View Dashboard with their 3-day trial menu already loaded. No tutorial screens or additional steps - direct access to value.

**ASCII Wireframe - First-Time Trial User (Week View):**

```
┌──────────────────────────────────┐
│ 🍽️ Bine ai venit!  🎁 Trial    │
├──────────────────────────────────┤
│ 📋 Primul tău plan de 3 zile ⏰ │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ 💡 Tooltip: Apasă pe mâncare│ │
│ │    pentru a vedea rețeta     │ │
│ │         [Am înțeles]         │ │
│ └──────────────────────────────┘ │
│┌─────┬─────┬─────┬─────────────┐│
││ZIUA1│ZIUA2│ZIUA3│    ZIUA 4   ││
│├─────┼─────┼─────┼─────────────┤│
││ 🥐  │ 🥞  │ 🍳  │    🔒       ││
││15m □│20m □│10m □│ Abonează-te ││
│├─────┼─────┼─────┼─────────────┤│
││ 🍲  │ 🥗  │ 🍝  │    🔒       ││
││30m □│25m □│25m □│ pentru toate││
│├─────┼─────┼─────┼─────────────┤│
││ 🍖  │ 🐟  │ 🍗  │    🔒       ││
││45m □│30m □│35m □│   mesele    ││
│└─────┴─────┴─────┴─────────────┘│
│                                  │
│ ⭐ Aceste 3 zile rămân ale tale │
│    pentru totdeauna! 🎁         │
│                                  │
│ [Începe să gătești] [Explorează]│
├──────────────────────────────────┤
│ Azi │ Săptămână │ Listă │ Cont  │
└──────────────────────────────────┘
```

**Progressive Tooltip System:**

- First interaction: "Apasă pe mâncare pentru rețeta"
- Shopping list: "Exportă PDF pentru magazin"
- Mark cooked: "Marchează când ai terminat"

Note: Trial menu remains accessible forever per business requirements

### Empty States (PRD-Compliant)

**Purpose:** Guide users when content is unavailable, avoiding impossible scenarios

**ASCII Wireframe - No Meals Cooked Yet:**

```
┌──────────────────────────────────┐
│ 🍽️ Săptămâna Ta                  │
├──────────────────────────────────┤
│                                  │
│         🍳                       │
│                                  │
│   Să începem să gătim!          │
│                                  │
│   Prima ta săptămână este       │
│   pregătită și te așteaptă.     │
│                                  │
│   [Vezi rețetele de azi]        │
│                                  │
│   💡 Sfat: Începe cu micul      │
│      dejun - e cel mai simplu!  │
│                                  │
└──────────────────────────────────┘
```

Note: Per FR86 - encouraging message for new users

**ASCII Wireframe - Between Weekly Plans:**

```
┌──────────────────────────────────┐
│ 🍽️ Între Planuri                 │
├──────────────────────────────────┤
│                                  │
│     ⏰ Noul plan vine în         │
│        14 ore și 23 minute      │
│                                  │
│   ┌────────────────────────────┐│
│   │ În continuare poți:        ││
│   │                            ││
│   │ 📖 Vezi planul precedent   ││
│   │ 🛒 Finalizează cumpărăturile││
│   │ ⭐ Evaluează rețetele     ││
│   └────────────────────────────┘│
│                                  │
│   [Vezi săptămâna trecută]      │
│                                  │
└──────────────────────────────────┘
```

Note: Per FR86 - shows countdown and maintains access to previous content

### Notifications & Toasts (PRD-Aligned)

**Purpose:** System notifications per NFR12 and payment flow notifications

**ASCII Wireframe - Plan Ready Notification:**

```
┌──────────────────────────────────┐
│ 🔔 ──────────────────────────── │
│                                  │
│    📅 Planul pentru săptămână    │
│        15-21 Ian este gata!     │
│                                  │
│    ✨ 28 de rețete delicioase    │
│       te așteaptă               │
│                                  │
│    [Vezi planul] [Mai târziu]   │
│                                  │
│    Se trimite Joia la 6:00 AM   │
│ ────────────────────────────── │
└──────────────────────────────────┘
```

Note: Per NFR12 - Thursday 6 AM plan ready notification

**ASCII Wireframe - Trial Upgrade Success (FR26 Compliance):**

```
┌──────────────────────────────────┐
│ 🎉 ──────────────────────────── │
│                                  │
│      Bine ai venit oficial       │
│      în familia Coquinate! 🏠   │
│                                  │
│   ✅ Plata de 50 RON confirmată  │
│   📅 Acces imediat la săptămâna │
│       curentă (15-21 Ian)       │
│                                  │
│   [Explorează planul complet]   │
│                                  │
│   📧 Chitanța a fost trimisă     │
│       pe email                  │
│ ────────────────────────────── │
└──────────────────────────────────┘
```

Note: Per FR26 - immediate access to current week regardless of payment day

**ASCII Wireframe - Shopping Reminder Toast:**

```
┌──────────────────────────────────┐
│ 🛒 ──────────────────────────── │
│                                  │
│  Reminder: Lista de cumpărături │
│  pentru săptămâna viitoare      │
│  este gata! 📝                  │
│                                  │
│  [Vezi lista] [Amână 1h]        │
│                                  │
│  Se trimite Vinerea la 5:00 PM  │
│ ────────────────────────────── │
└──────────────────────────────────┘
```

Note: Per NFR12 - Friday 5 PM shopping reminder

## Admin Dashboard Wireframes

### Admin Recipe Management Interface

**Purpose:** Manage recipe library efficiently per Story 3.2

**Key Elements per PRD:**

- Recipe list view with search, filter, sort capabilities
- Recipe creation/edit form with required fields
- Bulk import via CSV validation
- Recipe categorization and leftover flagging
- Draft vs Published status
- Quick edit mode for inline changes

**ASCII Wireframe - Recipe List View:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Gestionare Rețete                              [+ Rețetă Nouă] [⬆ Importă]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────┐ Filtre: [Toate▼] [Omnivor▼] [Publicate▼] [🔄 Reîncarcă] │
│ │ 🔍 Caută rețete...       │                                                          │
│ └──────────────────────────┘                                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────┬────────────────────┬──────────┬──────┬──────┬──────────┬───────┬──────────┐  │
│ │ □   │ Nume Rețetă        │ Categorie│ Timp │ Tip  │ Resturi  │Status │ Acțiuni  │  │
│ ├─────┼────────────────────┼──────────┼──────┼──────┼──────────┼───────┼──────────┤  │
│ │ ☑   │ Ciorbă de burtă    │ Prânz    │ 45m  │ Omni │ Da→3z    │ ✅ Pub │[✏️][👁️][🗑️]│  │
│ │ □   │ Omletă cu brânză   │ Mic dejun│ 10m  │ Ambele│ Nu      │ ✅ Pub │[✏️][👁️][🗑️]│  │
│ │ □   │ Sarmale tradiționale│ Cină    │ 120m │ Omni │ Da→5z    │ ✅ Pub │[✏️][👁️][🗑️]│  │
│ │ ☑   │ Salată de vinete   │ Gustare  │ 30m  │ Veg  │ Da→2z    │ 📝Ciornă│[✏️][👁️][🗑️]│  │
│ │ □   │ Paste Carbonara    │ Cină     │ 25m  │ Omni │ Nu       │ ✅ Pub │[✏️][👁️][🗑️]│  │
│ │ □   │ Mici cu muștar     │ Prânz    │ 20m  │ Omni │ Nu       │ ✅ Pub │[✏️][👁️][🗑️]│  │
│ └─────┴────────────────────┴──────────┴──────┴──────┴──────────┴───────┴──────────┘  │
│                                                                                        │
│ Afișare 6 din 147 rețete    [◄ Anterior] [1] 2 3 ... 25 [Următor ►]                 │
│                                                                                        │
│ Selectate: 2 rețete   [📤 Exportă Selectate] [🏷️ Etichetează] [🗑️ Șterge]          │
└────────────────────────────────────────────────────────────────────────────────────────┘

Legendă: ✏️ Editează, 👁️ Previzualizare/Test, 🗑️ Șterge, ✅ Publicat, 📝 Ciornă
```

**ASCII Wireframe - Recipe Creation/Edit Form:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Rețetă Nouă                              [💾 Salvează Ciornă] [✅ Salvează & Testează]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Informații de Bază                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Nume Rețetă (RO) *     [_____________________________________]                     │ │
│ │ Nume Rețetă (EN)       [_____________________________________] (opțional)          │ │
│ │                                                                                     │ │
│ │ Categorie *            [Mic Dejun ▼] Tip Meniu * [●Omnivor ○Vegetarian ○Ambele]    │ │
│ │ Timp Gătire *          [___] minute    Dificultate [Ușor ▼]                        │ │
│ │                                                                                     │ │
│ │ ☑ Creează Resturi      Durată Resturi [3▼] zile                                    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ Ingrediente (Integrare OpenFoodFacts)                [+ Adaugă Ingredient] [🔍 Caută] │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ • [500    ][g ▼] [Carne de vită 🔽______________] [✓ In DB] [🗑️]                   │ │
│ │                   ┌─────────────────────────────┐                                  │ │
│ │                   │ 🔍 OpenFoodFacts Results:    │                                  │ │
│ │                   │ • Carne de vită tocată 90%  │                                  │ │
│ │                   │ • Carne de vită friptură     │                                  │ │
│ │                   │ • Carne de vită pentru supă  │                                  │ │
│ │                   │ + Add new to database...     │                                  │ │
│ │                   └─────────────────────────────┘                                  │ │
│ │ • [2      ][buc▼] [Ceapă medie__________________] [✓ In DB] [🗑️]                   │ │
│ │ • [3      ][linguri▼] [Ulei de floarea soarelui_] [✓ In DB] [🗑️]                   │ │
│ │ • [100    ][g ▼] [Brânză telemea (manual entry) ] [⚠️ New ] [🗑️] [💾 Save to DB]   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ Instrucțiuni (Română) *                                [🤖 Generează cu AI]           │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. _______________________________________________________________________________ │ │
│ │ 2. _______________________________________________________________________________ │ │
│ │ 3. _______________________________________________________________________________ │ │
│ │ [+ Adaugă Pas]                                                                     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ Informații Nutriționale (per porție)                   [🔄 Calculează Automat]        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Calorii: [____] kcal     Proteine: [____] g      Carbohidrați: [____] g           │ │
│ │ Grăsimi: [____] g        Fibre: [____] g         Sodiu: [____] mg                 │ │
│ │                                                                                    │ │
│ │ [✓] Auto-calculează din ingrediente folosind datele OpenFoodFacts                 │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ [📷 Încarcă Imagine] Nicio imagine încărcată                                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Ingredient Database Lookup (OpenFoodFacts Integration)

**Purpose:** Search and manage ingredients from OpenFoodFacts database

**ASCII Wireframe - Ingredient Lookup Modal:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Ingredient Database Lookup                                                    [✖]   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│ │ 🔍 Search ingredients...  [morcov_____________________] [Search OpenFoodFacts]   │   │
│ └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│ Search Results (12 found):                                                             │
│ ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🥕 Morcov proaspăt                                              [+ Add to Recipe]│   │
│ │ │ Nutritional: 41 kcal/100g | Carbs: 9.6g | Fiber: 2.8g                       │ │   │
│ │ │ OpenFoodFacts ID: 3017620422003                                               │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🥕 Morcovi baby conservă                                         [+ Add to Recipe]│   │
│ │ │ Nutritional: 23 kcal/100g | Carbs: 4.7g | Sodium: 300mg                      │ │   │
│ │ │ OpenFoodFacts ID: 8710908932533                                               │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🥕 Suc de morcov bio                                             [+ Add to Recipe]│   │
│ │ │ Nutritional: 40 kcal/100ml | Carbs: 9.3g | Vitamin A: 835μg                  │ │   │
│ │ │ OpenFoodFacts ID: 4260028331234                                               │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│ Can't find ingredient?                                                                 │
│ ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│ │ Add Custom Ingredient:                                                           │   │
│ │ Name (RO): [_____________________] Name (EN): [_____________________]           │   │
│ │ Category: [Vegetables ▼] Unit: [g ▼] Calories/100g: [____]                      │   │
│ │ [💾 Add to Local Database]                                                       │   │
│ └──────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Recipe Import & Lookup

**Purpose:** Import recipes from external sources or find existing ones

**ASCII Wireframe - Recipe Import/Lookup:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 📚 Recipe Import & Lookup                                               [✖ Close]      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│ │ ○ Search Existing Recipes  ○ Import from URL  ○ Bulk CSV Import  ○ AI Generate │    │
│ └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                         │
│ Search Existing Recipes:                                                               │
│ ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│ │ 🔍 [sarmale_______________________] [🔍 Search]                                   │   │
│ │ Filters: [All Categories ▼] [All Types ▼] [Any Difficulty ▼]                     │   │
│ └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│ Results (3 recipes found):                                                             │
│ ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🍖 Sarmale tradiționale                                    [View] [Duplicate] │ │   │
│ │ │ Category: Dinner | Time: 120m | Difficulty: Medium | Type: Omnivore         │ │   │
│ │ │ Leftovers: Yes (5 days) | Status: Published                                 │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🥬 Sarmale de post                                          [View] [Duplicate] │ │   │
│ │ │ Category: Dinner | Time: 90m | Difficulty: Medium | Type: Vegetarian        │ │   │
│ │ │ Leftovers: Yes (3 days) | Status: Published                                 │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│ │ │ 🍖 Sarmale în foi de viță                                  [View] [Duplicate] │ │   │
│ │ │ Category: Dinner | Time: 100m | Difficulty: Hard | Type: Omnivore           │ │   │
│ │ │ Leftovers: Yes (4 days) | Status: Draft                                     │ │   │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │   │
│ └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│ Quick Actions:                                                                         │
│ [📥 Import Selected] [🔄 Create Variation] [📋 Copy to Meal Plan]                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Admin Validation Dashboard

**Purpose:** Ensure meal plan quality before publishing per Story 3.6

**ASCII Wireframe - Validation Dashboard:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Validare            Săptămână: 22-28 Ian    Status: ⚠️ 3 Avertismente, 1 Eroare│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Tip Meniu: [●Omnivor ○Vegetarian]                     [🔄 Re-validează] [📤 Publică]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ REZULTATE VALIDARE                                                                     │
│                                                                                        │
│ ❌ ERORI BLOCANTE (1)                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ❌ Meniuri Lipsă: Slotul de cină Joi este gol                                       │ │
│ │    → Acțiune: Adaugă o rețetă pentru cina de Joi                                   │ │
│ │    [🔧 Repară Acum]                                                                 │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ⚠️ AVERTISMENTE (3)                                                                    │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Listă Cumpărături: 47 articole unice (recomandat <40)                           │ │
│ │    → Consideră folosirea rețetelor cu ingrediente comune                           │ │
│ │    [👁️ Vezi Lista] [🔧 Optimizează]                                                │ │
│ ├────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ ⚠️ Timp Gătit: Duminica are 3.5 ore total gătit (mult)                             │ │
│ │    → Consideră mutarea unor preparate Sâmbăta                                      │ │
│ │    [📊 Vezi Distribuția]                                                           │ │
│ ├────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ ⚠️ Varietate: "Paste" apare de 3 ori săptămâna aceasta                             │ │
│ │    → Utilizatorii ar putea găsi asta repetitiv                                     │ │
│ │    [🔄 Sugerează Alternative]                                                      │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ✅ VERIFICĂRI TRECUTE (5)                                                              │
│ • Echilibru Nutrițional: Distribuție bună proteine/carbohidrați/legume                │
│ • Logică Resturi: Toate fluxurile conectate corect                                    │
│ • Cine În Timpul Săptămânii: Toate sub 30 minute                                      │
│ • Conținut Românesc: 85% rețete românești (țintă: >75%)                              │
│ • Disponibilitate Rețete: Toate rețetele testate și publicate                        │
│                                                                                        │
│ [Ignoră și Publică] necesită tastarea "IGNORĂ ȘI PUBLICĂ" pentru confirmare          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Admin Analytics View

**Purpose:** Track performance and improve content per Story 3.10

**ASCII Wireframe - Analytics Dashboard:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Analiză                    Săptămână: 15-21 Ian    [◄ Anterioară] [Următoare ►]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SUMAR PERFORMANȚĂ SĂPTĂMÂNĂ                                   [📊 Exportă Raport]      │
│ ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐       │
│ │ Rată Completare  │ Satisfacție Util.│ Rată Omitere     │ Utilizatori Activi│      │
│ │    72%          │     4.2/5        │    18%           │    247           │       │
│ │  ↑ +5% vs săpt. │   ↓ -0.1 vs săpt.│  ↓ -3% vs săpt. │  ↑ +12 vs săpt. │       │
│ └──────────────────┴──────────────────┴──────────────────┴──────────────────┘       │
│                                                                                        │
│ REȚETE CU PERFORMANȚĂ ÎNALTĂ                  REȚETE PROBLEMATICE                     │
│ ┌────────────────────────────────────┐      ┌────────────────────────────────────┐  │
│ │ 1. Omletă cu brânză     👍 95%    │      │ 1. Ciorbă de pește    👎 35%     │  │
│ │ 2. Paste Carbonara      👍 89%    │      │    "Prea complicată" (12 rapoarte)│  │
│ │ 3. Salată Caesar        👍 87%    │      │                                   │  │
│ │ 4. Sarmale              👍 85%    │      │ 2. Salată de vinete   ⏭️ 40% omit│  │
│ │ 5. Mici cu muștar       👍 82%    │      │    "Durează prea mult" (8 rapoarte)│ │
│ └────────────────────────────────────┘      └────────────────────────────────────┘  │
│                                                                                        │
│ SUMAR FEEDBACK (47 răspunsuri)                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Probleme Frecvente:                                                                │ │
│ │ • "Timpii de gătit nerealişti" - 15 mențiuni                                      │ │
│ │ • "Prea multe ingrediente neobișnuite" - 8 mențiuni                               │ │
│ │ • "Pregătirea de duminică prea ambițioasă" - 6 mențiuni                           │ │
│ │                                                                                    │ │
│ │ Feedback Pozitiv:                                                                 │ │
│ │ • "Îmi place sistemul cu resturi!" - 23 mențiuni                                  │ │
│ │ • "Lista de cumpărături e perfectă" - 19 mențiuni                                 │ │
│ │ • "Rețetele românești autentice" - 14 mențiuni                                    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ RECOMANDĂRI ACȚIONABILE                                 [🤖 Generează Recomandări]    │
│ • Înlocuiește "Ciorbă de pește" cu rețetă de pește mai simplă                        │
│ • Redu gătitul de duminică la maxim 2 ore                                            │
│ • Revizuiește și ajustează timpii de gătit pentru acuratețe                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Admin Emergency Operations Panel

**Purpose:** Handle crisis situations quickly per Story 3.9

**ASCII Wireframe - Emergency Operations:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🚨 Admin - Operațiuni de Urgență                            ⚠️ FOLOSIȚI CU PRECAUȚIE   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ACȚIUNI RAPIDE                                                                         │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [🔄 Revenire Săpt. Anterioară]  [⏸️ Activare Mod Mentenanță]  [📢 Trimite Notificare] │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ SCHIMBARE DE URGENȚĂ REȚETĂ                                                           │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Rețetă Problematică Curentă: [Selectează Rețetă ▼]                                 │ │
│ │ Înlocuiește Cu: [Selectează Înlocuitor ▼]                                          │ │
│ │ Utilizatori Afectați: 247 activi săptămâna aceasta                                 │ │
│ │ Motiv: [_____________________________________________________________]              │ │
│ │                                                                                    │ │
│ │ [🔄 Execută Schimbarea] Va actualiza imediat toți utilizatorii                    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ PUBLICARE FORȚATĂ                                                                      │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Validarea curentă are 3 erori care blochează publicarea                         │ │
│ │                                                                                    │ │
│ │ Tastați "IGNORĂ ȘI PUBLICĂ" pentru a forța: [_______________________]             │ │
│ │ Documentați motivul: [_____________________________________________________________]│ │
│ │                                                                                    │ │
│ │ [Publică Forțat] Ignoră toate validările                                          │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ NOTIFICARE SISTEM                                                                      │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Tip Mesaj: [●Urgent ○Informare ○Mentenanță]                                        │ │
│ │ Destinatari: [●Toți Utilizatorii ○Utilizatori Trial ○Utilizatori Plătiți]          │ │
│ │                                                                                    │ │
│ │ Mesaj: [_______________________________________________________________________]    │ │
│ │        [_______________________________________________________________________]    │ │
│ │                                                                                    │ │
│ │ [📤 Trimite Acum] Livrează ca notificare push + email                             │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ JURNAL INCIDENTE (Ultimele 5)                                                          │
│ • 2025-01-08 14:23 - Publicat forțat din cauza bug-ului de validare                  │
│ • 2024-12-24 09:15 - Revenire săptămână din cauza ingredientelor lipsă               │
│ • 2024-12-15 16:42 - Schimbare urgență: Înlocuit link rețetă expirat                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## User Account Management Wireframes

### Subscription Management

**Purpose:** User controls their subscription per Story 5.4

**ASCII Wireframe - Subscription Management:**

```
┌──────────────────────────────────┐
│ ◄ Gestionează Abonament          │
├──────────────────────────────────┤
│ PLANUL TĂU CURENT                │
│ ┌────────────────────────────┐  │
│ │ Plan: Lunar                │  │
│ │ 💳 50 RON/lună             │  │
│ │                            │  │
│ │ Următoarea plată:         │  │
│ │ 1 Februarie 2025           │  │
│ │                            │  │
│ │ Status: ✅ Activ           │  │
│ └────────────────────────────┘  │
│                                  │
│ SCHIMBĂ PLANUL                   │
│ ┌────────────────────────────┐  │
│ │ ○ Lunar - 50 RON/lună     │  │
│ │   Planul tău curent        │  │
│ │                            │  │
│ │ ○ Anual - 550 RON/an      │  │
│ │   💰 Economisești 50 RON   │  │
│ │   [Upgradeză și economisește]│ │
│ └────────────────────────────┘  │
│                                  │
│ METODA DE PLATĂ                  │
│ ┌────────────────────────────┐  │
│ │ 💳 •••• •••• •••• 4242    │  │
│ │ Expiră: 12/2026            │  │
│ │                            │  │
│ │ [Schimbă Card]             │  │
│ └────────────────────────────┘  │
│                                  │
│ MOD VACANȚĂ                      │
│ ┌────────────────────────────┐  │
│ │ ⏸️ Pune pauză abonamentului│  │
│ │ (până la 4 săptămâni)      │  │
│ │                            │  │
│ │ [Activează Mod Vacanță]    │  │
│ └────────────────────────────┘  │
│                                  │
│ ANULARE ABONAMENT                │
│ ┌────────────────────────────┐  │
│ │ ⚠️ Vei pierde accesul după│  │
│ │ 1 Februarie 2025           │  │
│ │                            │  │
│ │ [Anulează Abonament]       │  │
│ └────────────────────────────┘  │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

### Billing History

**Purpose:** View payment history and download invoices per Story 5.8

**ASCII Wireframe - Billing History:**

```
┌──────────────────────────────────┐
│ ◄ Istoric Facturi                │
├──────────────────────────────────┤
│ [📥 Exportă CSV] [🏢 Date Firmă]│
├──────────────────────────────────┤
│ 2025                             │
│ ┌────────────────────────────┐  │
│ │ 1 Ian 2025                 │  │
│ │ Abonament Lunar            │  │
│ │ 50,00 RON ✅ Plătit        │  │
│ │ [📄 Descarcă PDF]          │  │
│ ├────────────────────────────┤  │
│ │ 1 Dec 2024                 │  │
│ │ Abonament Lunar            │  │
│ │ 50,00 RON ✅ Plătit        │  │
│ │ [📄 Descarcă PDF]          │  │
│ ├────────────────────────────┤  │
│ │ 1 Nov 2024                 │  │
│ │ Abonament Lunar            │  │
│ │ 50,00 RON ✅ Plătit        │  │
│ │ [📄 Descarcă PDF]          │  │
│ ├────────────────────────────┤  │
│ │ 1 Oct 2024                 │  │
│ │ Abonament Lunar            │  │
│ │ 50,00 RON ✅ Plătit        │  │
│ │ [📄 Descarcă PDF]          │  │
│ └────────────────────────────┘  │
│                                  │
│ SUMAR ANUAL 2024                 │
│ ┌────────────────────────────┐  │
│ │ Total plătit: 150,00 RON   │  │
│ │ (3 luni active)            │  │
│ │                            │  │
│ │ Pentru deduceri fiscale:   │  │
│ │ [📄 Descarcă Sumar 2024]   │  │
│ └────────────────────────────┘  │
│                                  │
│ DATE FACTURARE (pentru firmă)    │
│ ┌────────────────────────────┐  │
│ │ Nume Firmă: -              │  │
│ │ CUI: -                     │  │
│ │ Adresă: -                  │  │
│ │                            │  │
│ │ [✏️ Adaugă Date Firmă]     │  │
│ └────────────────────────────┘  │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

### Meal History (Last 4 Weeks)

**Purpose:** View past meal names for reference per FR10

**ASCII Wireframe - Meal History:**

```
┌──────────────────────────────────┐
│ ◄ Istoricul Meselor             │
├──────────────────────────────────┤
│ 📅 Ultimele 4 Săptămâni         │
│ (doar numele rețetelor)          │
├──────────────────────────────────┤
│ SĂPTĂMÂNA 8-14 IANUARIE         │
│ ┌────────────────────────────┐  │
│ │ Luni                       │  │
│ │ • Omletă cu brânză         │  │
│ │ • Ciorbă de burtă          │  │
│ │ • Sarmale                  │  │
│ │ • Mere cu miere            │  │
│ │                            │  │
│ │ Marți                      │  │
│ │ • Clătite simple           │  │
│ │ • Salată Caesar            │  │
│ │ • Paste Carbonara          │  │
│ │ • Nuci și stafide          │  │
│ │                            │  │
│ │ [Vezi toată săptămâna ▼]   │  │
│ └────────────────────────────┘  │
│                                  │
│ SĂPTĂMÂNA 1-7 IANUARIE          │
│ ┌────────────────────────────┐  │
│ │ [Vezi meniurile ▼]         │  │
│ └────────────────────────────┘  │
│                                  │
│ SĂPTĂMÂNA 25-31 DECEMBRIE       │
│ ┌────────────────────────────┐  │
│ │ [Vezi meniurile ▼]         │  │
│ └────────────────────────────┘  │
│                                  │
│ SĂPTĂMÂNA 18-24 DECEMBRIE       │
│ ┌────────────────────────────┐  │
│ │ [Vezi meniurile ▼]         │  │
│ └────────────────────────────┘  │
│                                  │
│ 💡 Dorești rețetele complete?   │
│ Istoricul complet vine în        │
│ curând pentru abonații premium!  │
│                                  │
│ [📊 Raportează interes]         │
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

### My Trial Recipes (Forever Accessible)

**Purpose:** Access gifted trial recipes forever per FR8

**ASCII Wireframe - Trial Recipes:**

```
┌──────────────────────────────────┐
│ ◄ Rețetele Mele de Test 🎁      │
├──────────────────────────────────┤
│ Acestea sunt rețetele tale       │
│ pentru totdeauna - cadoul nostru │
│ pentru că ai încercat Coquinate! │
├──────────────────────────────────┤
│ ZIUA 1 - Prima Ta Zi             │
│ ┌────────────────────────────┐  │
│ │ 🍳 MIC DEJUN               │  │
│ │ Omletă cu Brânză           │  │
│ │ 10 minute • Ușor           │  │
│ │ [Vezi Rețeta]              │  │
│ ├────────────────────────────┤  │
│ │ 🍲 PRÂNZ                   │  │
│ │ Ciorbă de Legume           │  │
│ │ 30 minute • Mediu          │  │
│ │ [Vezi Rețeta]              │  │
│ ├────────────────────────────┤  │
│ │ 🍝 CINĂ                    │  │
│ │ Paste cu Sos Tomat         │  │
│ │ 25 minute • Ușor           │  │
│ │ [Vezi Rețeta]              │  │
│ ├────────────────────────────┤  │
│ │ 🍎 GUSTARE                 │  │
│ │ Măr cu Miere și Scorțișoară│ │
│ │ 5 minute • Foarte ușor     │  │
│ │ [Vezi Rețeta]              │  │
│ └────────────────────────────┘  │
│                                  │
│ ZIUA 2 - Descoperă Batch Cooking │
│ ┌────────────────────────────┐  │
│ │ [Extinde pentru rețete ▼]  │  │
│ └────────────────────────────┘  │
│                                  │
│ ZIUA 3 - Finalizarea Trial-ului  │
│ ┌────────────────────────────┐  │
│ │ [Extinde pentru rețete ▼]  │  │
│ └────────────────────────────┘  │
│                                  │
│ 💡 Îți plac rețetele?            │
│ Primește 28 de rețete noi        │
│ în fiecare săptămână!            │
│                                  │
│ [Abonează-te Acum - 50 RON/lună]│
├──────────────────────────────────┤
│ {t('tabs.today')} │ {t('tabs.week')} │ {t('tabs.list')} │ {t('tabs.account')}  │
└──────────────────────────────────┘
```

## Micro-interactions & Animations (Minimal but Polished)

**Essential animations only:**

- **Checkmark completion:** 300ms scale + fade when marking meal cooked
- **Card expansion:** 200ms height transition when showing recipe details
- **Loading states:** Skeleton screens matching layout (FR36)
- **Navigation transitions:** Standard iOS/Android patterns (slide, fade)
- **Drag feedback:** Ghost card while dragging in admin
- **Save indicator:** Subtle pulse on auto-save trigger

**Not implementing (avoid scope creep):**

- Complex parallax scrolling
- Decorative animations
- Custom loading spinners
- Page transition effects beyond standard
- Confetti or celebration animations

## Mobile-Specific Patterns

**Standard gestures users expect:**

- Swipe between days (horizontal)
- Pull-to-refresh for sync
- Long press for context actions
- Pinch to zoom on recipe images
- Back swipe for navigation (iOS)

**Avoiding:**

- Custom gesture combinations
- Shake actions
- 3D touch variations
- Complex multi-touch

## Missing Critical Wireframes

### User Settings & Preferences

**Purpose:** Allow users to customize their experience per Story 4.7

**ASCII Wireframe - Settings Screen:**

```
┌──────────────────────────────────┐
│ ◄ Setări                    💾   │
├──────────────────────────────────┤
│ PREFERINȚE GOSPODĂRIE            │
│ ┌────────────────────────────┐  │
│ │ Membri Gospodărie          │  │
│ │ [1] [2] [3] [4] [5] [6]   │  │
│ │      ●                     │  │
│ │                            │  │
│ │ Include copii?             │  │
│ │ [Nu ○] [●Da]              │  │
│ └────────────────────────────┘  │
│                                  │
│ TIP MENIU                        │
│ ┌────────────────────────────┐  │
│ │ ● Omnivor                  │  │
│ │ ○ Vegetarian               │  │
│ └────────────────────────────┘  │
│                                  │
│ VIZUALIZARE IMPLICITĂ           │
│ ┌────────────────────────────┐  │
│ │ ● Vedere Săptămână         │  │
│ │ ○ Focus Azi                │  │
│ └────────────────────────────┘  │
│                                  │
│ CATEGORII LISTĂ CUMPĂRĂTURI     │
│ ┌────────────────────────────┐  │
│ │ ↕️ Lactate                  │  │
│ │ ↕️ Carne & Pește            │  │
│ │ ↕️ Legume                   │  │
│ │ ↕️ Fructe                   │  │
│ │ ↕️ Condimente               │  │
│ │ [+ Adaugă Categorie]       │  │
│ └────────────────────────────┘  │
│                                  │
│ NOTIFICĂRI                       │
│ ┌────────────────────────────┐  │
│ │ Memento Gătit      [●On]   │  │
│ │ Săptămână Nouă     [●On]   │  │
│ │ Listă Cumpărături  [○Off]  │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Payment/Checkout Flow

**Purpose:** Stripe payment interface per Story 5.3

**ASCII Wireframe - Checkout:**

```
┌──────────────────────────────────┐
│ Finalizează Abonamentul    🔒    │
├──────────────────────────────────┤
│ ALEGE PLANUL TĂU                 │
│ ┌────────────────────────────┐  │
│ │ ● LUNAR                    │  │
│ │   50 RON/lună              │  │
│ │   Anulează oricând         │  │
│ ├────────────────────────────┤  │
│ │ ○ ANUAL (Economisește!)    │  │
│ │   550 RON/an              │  │
│ │   Economisești 50 RON      │  │
│ │   2 luni gratuite!         │  │
│ └────────────────────────────┘  │
│                                  │
│ INFORMAȚII PLATĂ                 │
│ ┌────────────────────────────┐  │
│ │ Număr Card                 │  │
│ │ [4242 4242 ····  ····]    │  │
│ │                            │  │
│ │ Data Expirare    CVV       │  │
│ │ [MM/YY]         [···]     │  │
│ │                            │  │
│ │ Nume pe Card               │  │
│ │ [Ion Popescu_______]       │  │
│ └────────────────────────────┘  │
│                                  │
│ REZUMAT COMANDĂ                  │
│ ┌────────────────────────────┐  │
│ │ Plan Lunar                 │  │
│ │ 50 RON/lună                │  │
│ │                            │  │
│ │ Prima plată: Azi           │  │
│ │ Următoarea: 10 Feb 2025   │  │
│ └────────────────────────────┘  │
│                                  │
│ ☑ Accept Termenii și Condițiile │
│                                  │
│ [💳 Plătește 50 RON]            │
│                                  │
│ Powered by Stripe • Securizat    │
└──────────────────────────────────┘
```

### Vacation Mode

**Purpose:** Pause subscription interface per Story 5.5

**ASCII Wireframe - Vacation Mode:**

```
┌──────────────────────────────────┐
│ ◄ Mod Vacanță              ✈️    │
├──────────────────────────────────┤
│ Pune abonamentul pe pauză când   │
│ ești plecat. Maxim 4 săptămâni.  │
│                                  │
│ STATUS CURENT                    │
│ ┌────────────────────────────┐  │
│ │ 🟢 Activ                    │  │
│ │ Următoarea plată: 10 Feb   │  │
│ └────────────────────────────┘  │
│                                  │
│ ACTIVEAZĂ MOD VACANȚĂ           │
│ ┌────────────────────────────┐  │
│ │ Data Start                 │  │
│ │ [📅 15 Feb 2025 ▼]        │  │
│ │                            │  │
│ │ Data Sfârșit               │  │
│ │ [📅 22 Feb 2025 ▼]        │  │
│ │                            │  │
│ │ Durată: 7 zile             │  │
│ └────────────────────────────┘  │
│                                  │
│ CE SE ÎNTÂMPLĂ:                  │
│ • Nu vei fi taxat în perioada   │
│   de pauză                      │
│ • Poți vedea rețetele anterioare│
│ • Nu primești planuri noi       │
│ • Reactivare automată la final  │
│                                  │
│ [Activează Mod Vacanță]         │
└──────────────────────────────────┘
```

### Shopping List PDF Export

**Purpose:** PDF layout for printing per FR6 & NFR3

**ASCII Wireframe - PDF View:**

```
┌─────────────────────[A4]─────────┐
│         COQUINATE                │
│    Listă de Cumpărături          │
│    Săptămâna 10-16 Feb 2025      │
│ ─────────────────────────────    │
│                                  │
│ LACTATE                          │
│ □ Lapte 3.5% - 2L                │
│ □ Brânză telemea - 400g          │
│ □ Smântână 20% - 300ml           │
│ □ Unt - 200g                     │
│                                  │
│ CARNE & PEȘTE                   │
│ □ Piept de pui - 1kg             │
│ □ Carne tocată vită - 500g       │
│ □ Cotlet de porc - 600g          │
│                                  │
│ LEGUME                           │
│ □ Cartofi - 2kg                  │
│ □ Ceapă - 1kg                    │
│ □ Morcovi - 500g                 │
│ □ Ardei roșu - 3 buc             │
│ □ Roșii - 1kg                    │
│ □ Usturoi - 2 căpățâni          │
│                                  │
│ CONDIMENTE & ALTELE             │
│ □ Ulei floarea soarelui - 1L     │
│ □ Făină - 1kg                    │
│ □ Orez - 500g                    │
│ □ Paste - 500g                   │
│ □ Boia dulce - 1 plic            │
│                                  │
│ ─────────────────────────────    │
│                                  │
│ Salvează timp. Gătește acasă.    │
│ www.coquinate.ro                 │
└──────────────────────────────────┘
```

### Recipe Cooking Assistant (AI-Powered)

**Purpose:** AI chat interface for cooking help per Story 4.9

**ASCII Wireframe - Cooking Assistant:**

```
┌──────────────────────────────────┐
│ ◄ Asistent Gătit           🤖    │
├──────────────────────────────────┤
│ Ciorbă de Legume                 │
│ ──────────────────────────────── │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 🤖 Bună! Te ajut să gătești │  │
│ │ Ciorba de Legume. La ce    │  │
│ │ pas ești acum?              │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 👤 Am tăiat legumele dar nu │  │
│ │ știu cât să le călesc        │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 🤖 Călește legumele tari    │  │
│ │ (morcovi, țelină) pentru    │  │
│ │ 3-4 minute până se          │  │
│ │ înmoaie puțin. Apoi adaugă  │  │
│ │ ceapa și mai călește 2 min  │  │
│ │ până devine translucidă.    │  │
│ └────────────────────────────┘  │
│                                  │
│ ÎNTREBĂRI RAPIDE:                │
│ [Ce pot substitui?]              │
│ [Cum verific dacă e gata?]       │
│ [Am ars ceva, ce fac?]           │
│                                  │
│ ┌────────────────────────────┐  │
│ │ Scrie întrebarea ta...      │  │
│ │ [___________________] [→]   │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Payment Failure Recovery Flow

**Purpose:** Handle failed payments with grace period per Story 5.6

**ASCII Wireframe - Payment Recovery:**

```
┌──────────────────────────────────┐
│ ⚠️ Plată Eșuată                  │
├──────────────────────────────────┤
│ Nu am putut procesa plata ta     │
│ automată pentru această lună.    │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 📅 Data încercării:        │  │
│ │    10 Februarie 2025       │  │
│ │                            │  │
│ │ ❌ Motiv:                   │  │
│ │    Card expirat            │  │
│ │                            │  │
│ │ ⏰ Perioadă de grație:     │  │
│ │    7 zile (până 17 Feb)    │  │
│ └────────────────────────────┘  │
│                                  │
│ CE URMEAZĂ:                      │
│ • Accesul tău continuă 7 zile   │
│ • Vom încerca din nou în 3 zile │
│ • Primești email cu instrucțiuni│
│                                  │
│ REZOLVĂ ACUM:                    │
│ ┌────────────────────────────┐  │
│ │ [💳 Actualizează Cardul]   │  │
│ │                            │  │
│ │ [🔄 Încearcă Din Nou]      │  │
│ │                            │  │
│ │ [📧 Contactează Suport]    │  │
│ └────────────────────────────┘  │
│                                  │
│ Alternative de plată:            │
│ • Transfer bancar               │
│ • Contactează suport            │
│                                  │
│ [Mai târziu]                    │
└──────────────────────────────────┘
```

### Tab Setări Admin

**Purpose:** Configurare setări dashboard admin

**ASCII Wireframe - Setări Admin:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Setări                                                    [💾 Salvează Tot] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┬──────────────────────────────────────────┐│
│ │ SETĂRI GENERALE                         │ CONFIGURARE AI                           ││
│ │                                         │                                          ││
│ │ Limbă Dashboard:                        │ Cheie API Gemini:                        ││
│ │ [Română ▼]                              │ [••••••••••••••••••••]                  ││
│ │                                         │                                          ││
│ │ Fus Orar:                               │ Funcții AI:                              ││
│ │ [Europe/București ▼]                    │ ☑ Generare Rețete                       ││
│ │                                         │ ☑ Asistent Plan Mese                    ││
│ │ Status Implicit Rețetă:                 │ ☑ Ajutor Validare                       ││
│ │ [Ciornă ▼]                              │ ☑ Analiză Nutrițională                  ││
│ │                                         │                                          ││
│ │ Interval Salvare Automată:              │ Model AI Preferat:                       ││
│ │ [5 minute ▼]                            │ [Gemini 2.5 Flash ▼]                    ││
│ └─────────────────────────────────────────┴──────────────────────────────────────────┘│
│                                                                                        │
│ ┌─────────────────────────────────────────┬──────────────────────────────────────────┐│
│ │ SETĂRI PUBLICARE                        │ SETĂRI NOTIFICĂRI                        ││
│ │                                         │                                          ││
│ │ Zi Publicare Săptămânală:               │ Notificări Email:                        ││
│ │ [Duminică ▼]                            │ ☑ Plan săptămânal publicat              ││
│ │                                         │ ☑ Eșecuri validare                      ││
│ │ Oră Publicare:                          │ ☑ Inventar rețete scăzut (<20)          ││
│ │ [18:00 ▼]                               │ ☑ Rezumat feedback utilizatori          ││
│ │                                         │                                          ││
│ │ Auto-publicare după validare:           │ Praguri Alertă:                          ││
│ │ [Da ▼]                                  │ Minim rețete: [20___]                   ││
│ │                                         │ Feedback negativ: [30%▼]                ││
│ │ Necesită aprobare manuală:              │                                          ││
│ │ [Nu ▼]                                  │ Email Admin:                             ││
│ │                                         │ [admin@coquinate.ro____]                ││
│ └─────────────────────────────────────────┴──────────────────────────────────────────┘│
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐│
│ │ BACKUP & MENTENANȚĂ                                                                 ││
│ │                                                                                      ││
│ │ Backup-uri Automate:      [Zilnic ▼]     Ultimul Backup: 2025-01-10 03:00          ││
│ │ Păstrare Backup-uri:      [30 zile ▼]    Spațiu Folosit: 234 MB / 5 GB            ││
│ │                                                                                      ││
│ │ [📥 Descarcă Backup]  [🔄 Backup Acum]  [📊 Vezi Loguri]  [🧹 Curăță Cache]        ││
│ └────────────────────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Visual Leftover Flow Connections

**Purpose:** Show leftover connections in meal plan builder

**ASCII Wireframe - Leftover Flow Visualization:**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Admin - Constructor Plan Mese (Fluxuri Vizuale Resturi)           [👁️ Previzualizare]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Săptămâna 11 - Plan Omnivor                                    Urmărire Resturi: ACTIV │
├────────────────────────────────────────────────────────────────────────────────────────┤
│         LUNI          MARȚI         MIERCURI        JOI           VINERI               │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│ │MIC DEJUN    │  │MIC DEJUN    │  │MIC DEJUN    │  │MIC DEJUN    │  │MIC DEJUN    │ │
│ │Omletă       │  │Ouă fierte   │  │Brânză/Roșii │  │Omletă veggie│  │Iaurt/Granola│ │
│ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                                        │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│ │PRÂNZ        │  │PRÂNZ 🔄2d   │══╗│PRÂNZ        │  │PRÂNZ 🔄3d   │══╗│PRÂNZ        │ │
│ │Ciorbă burtă │  │Sarmale      │  ║│← Sarmale(L) │  │Paste Carb.  │  ║│← Paste(L)   │ │
│ └─────────────┘  └─────────────┘  ║└─────────────┘  └─────────────┘  ║└─────────────┘ │
│                                    ║                                   ║                │
│ ┌─────────────┐  ┌─────────────┐  ║┌─────────────┐  ┌─────────────┐  ║┌─────────────┐ │
│ │GUSTARE      │  │GUSTARE      │  ║│GUSTARE      │  │GUSTARE      │  ║│GUSTARE      │ │
│ │Fructe       │  │Nuci/Mere    │  ║│Iaurt        │  │Biscuiți     │  ║│Fructe       │ │
│ └─────────────┘  └─────────────┘  ║└─────────────┘  └─────────────┘  ║└─────────────┘ │
│                                    ║                                   ║                │
│ ┌─────────────┐  ┌─────────────┐  ║┌─────────────┐  ┌─────────────┐  ║┌─────────────┐ │
│ │CINĂ 🔄3d    │══════════════════╗║│CINĂ         │  │CINĂ         │  ╚╗│CINĂ        │ │
│ │Tocăniță vită│                  ║╚╗│Pui grătar   │  │Pește cuptor │   ║│← Tocăniță(L)│ │
│ └─────────────┘                  ║ ║└─────────────┘  └─────────────┘   ║└─────────────┘ │
│                                  ╚═╩════════════════════════════════════╝              │
│                                                                                        │
│ LEGENDĂ:                                                                               │
│ 🔄2d = Creează resturi 2 zile     ══╗ = Conexiune flux resturi                       │
│ ← Nume(R) = Folosește resturi     ╚═╝ = Vizualizare traseu flux                      │
│                                                                                        │
│ STATUS VALIDARE:                                                                       │
│ ✅ Fluxuri resturi verificate     ⚠️ 2 rețete creează resturi 3+ zile                │
│ ✅ Fără resturi orfane           ✅ Toate conexiunile valide                          │
│                                                                                        │
│ [🔄 Auto-Conectare Resturi] [❌ Șterge Toate Fluxurile] [💾 Salvează Plan]           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
