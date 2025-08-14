# Image Assets Guide

## Folder Structure

### 📁 `/hero`

**Pentru imagini hero de pe pagina principală și landing pages**

Pune aici:

- `hero-home.jpg` - Imaginea principală homepage (1920x1080)
- `hero-home-mobile.jpg` - Versiune mobile (768x1024)
- `hero-about.jpg` - Hero pentru pagina About
- `hero-pricing.jpg` - Hero pentru pagina Pricing

Naming convention: `hero-[page]-[variant].jpg`

### 📁 `/marketing`

**Pentru imagini generale de marketing**

Pune aici:

- Banner-uri promoționale
- Imagini pentru campanii
- Social media assets
- Newsletter graphics

### 📁 `/features`

**Pentru imagini care ilustrează funcționalități**

Pune aici:

- `feature-meal-planning.png` - Screenshot/ilustrație planificare
- `feature-shopping-list.png` - Screenshot listă cumpărături
- `feature-recipes.png` - Screenshot rețete
- Icons sau ilustrații pentru fiecare feature

### 📁 `/testimonials`

**Pentru avatare și imagini testimoniale**

Pune aici:

- Avatar-uri clienți
- Logo-uri companii (dacă ai B2B)
- Imagini de fundal pentru secțiunea testimoniale

## Dimensiuni Recomandate

### Hero Images

- Desktop: 1920x1080 (16:9)
- Tablet: 1024x768 (4:3)
- Mobile: 768x1024 (3:4)

### Feature Images

- Standard: 800x600
- Thumbnail: 400x300
- Icon: 200x200

## Formate Recomandate

- **WebP** - Pentru toate imaginile (suport modern, dimensiune mică)
- **JPG** - Fallback pentru browsere vechi
- **SVG** - Pentru logo-uri și iconuri
- **PNG** - Pentru imagini cu transparență

## Cum să folosești în cod

```tsx
// Import direct
import Image from 'next/image'

// Hero image
<Image
  src="/images/hero/hero-home.jpg"
  alt="Coquinate - Planificare inteligentă pentru mese românești"
  width={1920}
  height={1080}
  priority // Pentru hero images
/>

// Feature image
<Image
  src="/images/features/feature-meal-planning.png"
  alt="Planificare automată a meselor"
  width={800}
  height={600}
  loading="lazy" // Pentru imagini below the fold
/>
```

## Optimizare

1. **Compresia**: Folosește [TinyPNG](https://tinypng.com/) sau [Squoosh](https://squoosh.app/)
2. **Responsive**: Pregătește cel puțin 3 dimensiuni (desktop, tablet, mobile)
3. **Format**: Convertește la WebP pentru performanță optimă
4. **Lazy Loading**: Next.js face asta automat cu Image component

## Naming Convention

```
[type]-[page]-[variant]-[size].[format]

Exemple:
- hero-home-desktop.webp
- hero-home-mobile.webp
- feature-recipes-thumbnail.jpg
- testimonial-maria-avatar.png
```
