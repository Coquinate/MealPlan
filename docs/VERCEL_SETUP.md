# Vercel Setup Guide pentru Coquinate

## 🚀 Configurare Completă pentru Deploy pe Vercel

### 1. Environment Variables (Setări în Dashboard Vercel)

Navighează la: **Project Settings → Environment Variables**

Adaugă următoarele variabile:

#### Supabase (Obligatorii)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hkghwdexiobvaoqkpxqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

#### Stripe (Pentru plăți)

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### AI & Email (Pentru funcționalități AI și email)

```env
GEMINI_API_KEY=AIzaSy...
RESEND_API_KEY=re_...
```

#### Cache Settings (Opțional)

```env
NEXT_PUBLIC_CACHE_ENABLED=true
NEXT_PUBLIC_CACHE_MAX_ITEMS=50
NEXT_PUBLIC_CACHE_TTL_DAYS=7
```

### 2. Build & Development Settings

În **Project Settings → General**:

- **Framework Preset**: Next.js
- **Node.js Version**: 22.x
- **Package Manager**: pnpm
- **Root Directory**: `./` (lăsați gol)
- **Build Command**: (folosește din vercel.json)
- **Output Directory**: (folosește din vercel.json)
- **Install Command**: (folosește din vercel.json)

### 3. Domains & URLs

În **Project Settings → Domains**:

1. Adaugă domeniul tău custom (dacă ai)
2. Sau folosește domeniul Vercel generat: `coquinate-web.vercel.app`

### 4. Password Protection (Dezactivare pentru Production)

În **Project Settings → Password Protection**:

- **Dezactivează** pentru Production deployment
- Poți activa pentru Preview deployments dacă vrei

### 5. Functions Region

În **Project Settings → Functions**:

- **Region**: `fra1` (Frankfurt) pentru Europa
- Sau alege regiunea cea mai apropiată de utilizatorii tăi

### 6. Verificare Post-Deploy

După deploy, verifică:

1. **Build Logs**: Verifică că nu sunt erori
2. **Function Logs**: Pentru API routes
3. **Analytics**: Pentru performanță

### 7. Probleme Comune și Soluții

#### Eroare 401 Unauthorized

- Verifică că Password Protection este dezactivat
- Verifică environment variables

#### Build Failed - Module not found

- Verifică că toate dependențele sunt în package.json
- Clear cache și re-deploy: `vercel --force`

#### Styles nu se încarcă

- Verifică că scriptul copy-styles funcționează
- Build-ul UI package trebuie să copieze CSS în dist

#### Database Connection Failed

- Verifică SUPABASE keys
- Verifică că IP-urile Vercel sunt whitelisted în Supabase

### 8. CLI Commands Utile

```bash
# Deploy manual
npx vercel --prod

# Verifică logs
npx vercel logs [deployment-url]

# List deployments
npx vercel list

# Inspect deployment
npx vercel inspect [deployment-url]

# Environment variables
npx vercel env pull  # Download .env.local
npx vercel env add   # Add new env var
```

### 9. GitHub Integration

Pentru auto-deploy:

1. **Vercel Dashboard → Import Project**
2. Conectează repository-ul GitHub
3. Vercel va face auto-deploy la fiecare push pe `master`

### 10. Monitoring & Alerts

Activează în **Project Settings → Monitoring**:

- Error tracking
- Performance monitoring
- Custom alerts pentru downtime

## 📝 Checklist Final

- [ ] Environment variables configurate
- [ ] Password protection dezactivat pentru production
- [ ] Domain configurat (custom sau .vercel.app)
- [ ] Build successful fără erori
- [ ] Styles (CSS) se încarcă corect
- [ ] Database connection funcționează
- [ ] API routes răspund corect
- [ ] Email sending funcționează (dacă e cazul)

## 🆘 Support

Pentru probleme, verifică:

1. Build logs în Vercel Dashboard
2. Function logs pentru API errors
3. Browser DevTools pentru client-side errors
4. Supabase Dashboard pentru database issues

---

_Actualizat: 16 August 2025_
_Status: Web app deployable pe Vercel_
