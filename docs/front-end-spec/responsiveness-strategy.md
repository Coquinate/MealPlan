# Responsiveness Strategy

## Core Approach: Hybrid Smart Defaults

Standard Tailwind breakpoints with view-specific optimizations

## Breakpoints

| Breakpoint | Width   | Tailwind | Usage                       |
| ---------- | ------- | -------- | --------------------------- |
| Base       | <640px  | default  | Mobile phones               |
| Small      | ≥640px  | `sm:`    | Large phones, small tablets |
| Large      | ≥1024px | `lg:`    | Tablets, desktops           |

## Implementation Patterns

**Default Responsive Grid:**

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"></div>
```

**View-Specific Optimizations:**

**Shopping List:** Capped width for readability

```html
<div class="max-w-2xl mx-auto px-4">
  <!-- Always single column, centered on desktop -->
</div>
```

**Cooking Mode:** Focus view with optional sidebar

```html
<div class="lg:grid lg:grid-cols-[1fr,320px]">
  <main><!-- Recipe --></main>
  <aside class="hidden lg:block"><!-- Timer/notes --></aside>
</div>
```

**Planning:** Full responsive grid

```html
<div class="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7">
  <!-- 1 day mobile, 4 days tablet, 7 days desktop -->
</div>
```
