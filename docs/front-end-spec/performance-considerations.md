# Performance Considerations

## Performance Goals

- **Page Load:** Under 3 seconds on 4G
- **Images:** Compressed JPEGs under 200kb
- **Bundle:** Whatever Vite outputs

## Design Strategies

- Let Vite handle bundling
- Use loading="lazy" on images
- Compress images once with TinyPNG
- Host in Europe (users are Romanian)
- That's it

## What We're NOT Doing

- Performance monitoring
- Bundle analysis
- Service workers
- CDN setup
- Image optimization pipeline
- Lighthouse CI
