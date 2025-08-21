# Launch Mode Configuration Guide

## Overview

Coquinate uses a **Launch Mode System** to control site accessibility during different deployment phases across multiple domains. This prevents unfinished features from being accessible to the public while allowing controlled rollout.

## Multi-Domain Support

The launch mode system works seamlessly across both primary domains:
- **coquinate.ro** - Romanian market (primary)  
- **coquinate.com** - International market

Both domains share the same launch mode configuration and behavior, with domain-specific optimizations handled by the `domain-utils.ts` utility functions.

## How It Works

The system uses an environment variable `NEXT_PUBLIC_LAUNCH_MODE` to determine which routes are accessible. A middleware intercepts all requests and blocks/redirects based on the current launch mode.

## Launch Modes

### 1. Coming Soon Mode (`coming-soon`)
**Purpose:** Marketing homepage phase with value proposition (Story 2.2) but no app access  
**Default Mode:** Yes
**Available on:** Both coquinate.ro and coquinate.com

**Important Clarification:** Despite the name "coming-soon", this mode displays the **full marketing homepage** with Hero section, Features, and CTA - not a simple placeholder. The name indicates that the actual app features are "coming soon".

**Accessible Routes:**
- `/` - Full marketing homepage with value proposition
- `/privacy` - Privacy Policy (legally required)
- `/terms` - Terms of Service (legally required)
- `/api/newsletter` - Newsletter signup endpoint
- `/api/email-signup` - Email capture endpoint
- `/api/subscribe` - Subscription endpoint
- `/api/health` - Health check endpoint

**Blocked:** Everything else redirects to `/`

**Domain Behavior:**
- Both domains show identical content
- Domain-specific metadata handled by `domain-utils.ts`
- Canonical URLs point to appropriate domain (.ro for Romanian, .com for international)

**When to Use:**
- Initial deployment with marketing content ready
- Building anticipation while showing product value
- App features still in development

**SEO:** `noindex, nofollow` - prevents search engine indexing

### 2. Full Launch Mode (`full-launch`)
**Purpose:** Complete site availability across all domains
**Available on:** Both coquinate.ro and coquinate.com

**Accessible Routes:** Everything - complete application access

**Domain-Specific Features:**
- Automatic domain detection using `getDomain(headers)`
- Canonical URLs generated with `getCanonicalUrl()`
- Cross-domain alternate URLs via `getAlternateUrls()`
- Future support for domain-based redirects (currently disabled)

**When to Use:**
- Official product launch
- All features tested and ready
- Open for business on both markets

**SEO:** `index, follow` - full search engine visibility

## Configuration

### Environment Variable

Add to your `.env` file:
```env
NEXT_PUBLIC_LAUNCH_MODE=coming-soon
```

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_LAUNCH_MODE` with value `coming-soon`
3. Deploy or redeploy to apply

### Changing Launch Mode

**Local Development:**
1. Edit `.env` file
2. Change `NEXT_PUBLIC_LAUNCH_MODE` value
3. Restart dev server

**Production (Vercel):**
1. Go to Environment Variables in Vercel
2. Update `NEXT_PUBLIC_LAUNCH_MODE` value
3. Trigger redeployment (or it will apply on next deploy)

**No Code Changes Required!** Just update the environment variable.

## Multi-Domain Configuration

### Domain Detection
The system automatically detects which domain is being accessed:
- `coquinate.com` → detected as 'com' 
- `coquinate.ro` → detected as 'ro'
- `localhost` → defaults to 'ro'

### Domain Utilities (`/apps/web/src/lib/domain-utils.ts`)

**Key Functions:**
```typescript
// Detect current domain from request headers
getDomain(headers?: Headers): 'ro' | 'com'

// Generate canonical URL for SEO
getCanonicalUrl(pathname: string, domain?: 'ro' | 'com'): string

// Get both domain versions of a URL
getAlternateUrls(pathname: string): { ro: string; com: string }

// Future: domain-based redirects (currently disabled)
shouldRedirectDomain(headers: Headers): boolean
```

**Usage Examples:**
```typescript
// In middleware or server components
const domain = getDomain(request.headers);
const canonicalUrl = getCanonicalUrl('/pricing', domain);
const alternates = getAlternateUrls('/about');

// Results in:
// canonicalUrl: "https://coquinate.ro/pricing" or "https://coquinate.com/pricing"
// alternates: { 
//   ro: "https://coquinate.ro/about", 
//   com: "https://coquinate.com/about" 
// }
```

### Metadata and SEO Considerations

**Canonical URLs:** Each page automatically generates the correct canonical URL based on the domain being accessed.

**Alternate Language URLs:** Both domain versions are provided as alternates:
- `coquinate.ro` includes `<link rel="alternate" hreflang="ro-RO" href="https://coquinate.ro/page">`
- `coquinate.com` includes `<link rel="alternate" hreflang="en-US" href="https://coquinate.com/page">`

**Email Addresses:** Domain-appropriate contact emails are used:
- `coquinate.ro` → `contact@coquinate.ro`, `gdpr@coquinate.ro`  
- `coquinate.com` → `support@coquinate.com`

## Implementation Files

### Core Files
- `/apps/web/src/lib/launch-config.ts` - Launch mode configuration and routing logic
- `/apps/web/src/lib/domain-utils.ts` - Multi-domain detection and URL generation
- `/apps/web/src/middleware.ts` - Request interception and blocking
- `/apps/web/public/robots.txt` - Multi-domain sitemap references

### Page Structure
```
apps/web/src/app/
├── (marketing)/
│   ├── page.tsx         # Homepage (Coming Soon or Full)
│   └── layout.tsx       # Marketing layout
├── (app)/               # Protected app routes
└── (legal)/             # Always accessible legal pages
```

## Launch Checklist

### Before Coming Soon Launch
- [ ] Set `NEXT_PUBLIC_LAUNCH_MODE=coming-soon` in production
- [ ] Deploy Coming Soon page design
- [ ] Test email capture functionality on both domains
- [ ] Verify Privacy and Terms pages accessible on coquinate.ro and coquinate.com  
- [ ] Confirm all other routes redirect to home
- [ ] Verify domain detection works correctly
- [ ] Test canonical URLs and alternate language tags

### Before Full Launch
- [ ] All features tested and ready
- [ ] Update `NEXT_PUBLIC_LAUNCH_MODE=full-launch`
- [ ] Remove any "coming soon" messaging
- [ ] Update robots.txt for SEO on both domains
- [ ] Test cross-domain functionality
- [ ] Verify domain-specific email addresses work
- [ ] Test metadata generation for both domains
- [ ] Announce official launch

## Testing Launch Modes

### Local Testing
```bash
# Test Coming Soon mode
NEXT_PUBLIC_LAUNCH_MODE=coming-soon pnpm dev

# Test Full Launch mode
NEXT_PUBLIC_LAUNCH_MODE=full-launch pnpm dev
```

### Verify Blocking Works
1. Set mode to `coming-soon`
2. Try accessing `/dashboard` - should redirect to `/`
3. Try accessing `/pricing` - should redirect to `/`
4. Access `/privacy` - should work
5. Access `/` - should show Coming Soon page

### Multi-Domain Testing
```bash
# Test domain detection (requires host header modification)
curl -H "Host: coquinate.ro" http://localhost:3000/
curl -H "Host: coquinate.com" http://localhost:3000/

# Or use browser developer tools to modify Host header
```

**Production Testing:**
1. Visit `https://coquinate.ro/` - verify Romanian domain behavior
2. Visit `https://coquinate.com/` - verify international domain behavior  
3. Check canonical URLs in page source
4. Verify alternate language tags are present
5. Test email addresses are domain-appropriate

## Troubleshooting

### Routes Not Blocking
- Check `NEXT_PUBLIC_LAUNCH_MODE` is set correctly
- Ensure middleware.ts is properly configured
- Clear browser cache and cookies
- Restart Next.js dev server

### Environment Variable Not Working
- Prefix must be `NEXT_PUBLIC_` for client-side access
- Rebuild/redeploy after changing in production
- Check Vercel logs for environment variable values

### Middleware Not Running
- Check `middleware.ts` is in `apps/web/src/` directory
- Verify matcher configuration in middleware
- Check for TypeScript errors in middleware file

## Security Benefits

1. **No Leaked Features:** Unfinished features cannot be discovered
2. **Controlled Rollout:** Test with specific user groups
3. **Quick Rollback:** Change mode instantly without code changes
4. **SEO Control:** Prevent indexing until ready

## Future Enhancements

### Multi-Domain Features
- [ ] Domain-based automatic redirects (Romanian users → .ro, others → .com)
- [ ] Geographic launch modes per domain
- [ ] Domain-specific feature toggles
- [ ] Cross-domain user migration tools

### Advanced Launch Controls
- [ ] A/B testing between launch modes
- [ ] User-specific access (allowlist)
- [ ] Gradual percentage rollout
- [ ] Time-based automatic transitions
- [ ] Market-specific launch schedules

## Related Documentation

- [Deployment Runbook](../deployment-runbook.md#launch-sequence)
- [Story 2.1: Coming Soon Landing Page](../stories/2.1.story.md)
- [Story 2.2: Homepage Value Proposition](../stories/2.2.homepage-value-proposition.md)
- [Epic 2: Marketing Website](../prd/epic-2-marketing-website-trial-experience.md)

---

**Last Updated:** January 19, 2025  
**Author:** Sarah (Product Owner)  
**Status:** Active Configuration