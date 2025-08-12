# Accessibility Requirements

## Compliance Target

**Standard:** WCAG 2.1 Level A (legal minimum for Romanian/EU markets)

## Critical Requirements Only

**Visual:**

- Color contrast: 4.5:1 for text (use a contrast checker once, done)
- Focus indicators: Browser defaults are fine

**Interaction:**

- Keyboard navigation: Tab through forms (browser handles this)
- Touch targets: 44×44px minimum (Apple/Google requirement)

**Content:**

- Alt text: Only for recipe images (empty alt="" for icons)
- Form labels: HTML labels for inputs (basic requirement)

## Testing Strategy

- Run free Chrome Lighthouse audit once before launch
- Test tab navigation on login/signup flows only
- That's it
