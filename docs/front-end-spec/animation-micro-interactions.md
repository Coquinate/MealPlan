# Animation & Micro-interactions

## Motion Principles

- **Functional only** - Every animation serves a purpose
- **Lightning fast** - 150-250ms maximum
- **Accessibility first** - Full disable option, not just reduce
- **Battery conscious** - GPU-optimized, no constant animations

## Core Animations

- **Check item (shopping):** translateX(8px) + opacity(0.5) - 150ms
- **Mark cooked:** opacity(0.7) + checkmark appear - 200ms
- **Page transition:** opacity fade only - 200ms
- **Loading:** Static skeleton (no shimmer - saves battery)
- **Toast:** translateY(-20px) + opacity - 250ms
- **Week complete:** subtle scale(1.02) - 400ms (only celebration)

## Implementation

```css
:root {
  --anim-fast: 150ms;
  --anim-normal: 250ms;
  --easing: ease-out;
}

/* True accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

## Explicitly NOT Doing

- Continuous animations (battery drain)
- Scale/bounce effects (vestibular issues)
- Decorative transitions
- Loading spinners (use skeletons)
- Animation libraries
