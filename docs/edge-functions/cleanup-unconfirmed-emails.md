# Cleanup Unconfirmed Emails Edge Function

## Descriere

Această funcție Edge eliminează înregistrările de e-mail neconfirmate din baza de date după 7 zile. Este proiectată să ruleze automat prin intermediul unui cron job sau să fie apelată manual.

## URL Funcție

```
https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails
```

## Autentificare și Securitate

Funcția necesită următoarele pentru autentificare:

1. **Header-ul Authorization**: Bearer token cu cheia Supabase
2. **Header-ul x-cleanup-secret**: Secret configurat în variabilele de mediu
3. **Metoda HTTP**: POST

## Variabile de Mediu Necesare

```env
SUPABASE_URL=https://hkghwdexiobvaoqkpxqj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLEANUP_SECRET=secure-cleanup-key-[timestamp]
ALLOWED_ORIGINS=https://coquinate.ro,https://coquinate.com
```

## Funcționalitate

Funcția efectuează următoarele operațiuni:

1. **Validare securitate**: Verifică secret-ul de cleanup pentru prevenirea accesului neautorizat
2. **Identificare înregistrări**: Găsește toate înregistrările din `email_signups` cu:
   - `confirmed = false`
   - `created_at < 7 zile în urmă`
3. **Curățare cascadă**: 
   - Șterge mai întâi înregistrările asociate din `email_confirmations`
   - Apoi șterge înregistrările din `email_signups`
4. **Logging**: Înregistrează operațiunile pentru audit și debugging

## Exemplu de Apelare

### cURL
```bash
curl -X POST \
  "https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -H "x-cleanup-secret: secure-cleanup-key-[timestamp]"
```

### JavaScript
```javascript
const response = await fetch('https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'x-cleanup-secret': process.env.CLEANUP_SECRET
  }
});

const result = await response.json();
console.log(result);
```

## Răspunsuri

### Succes
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "deletedCount": 5,
  "cutoffDate": "2025-08-17T22:11:42.000Z",
  "timestamp": "2025-08-24T22:11:42.000Z"
}
```

### Niciun element de curățat
```json
{
  "success": true,
  "message": "No unconfirmed signups to cleanup",
  "deletedCount": 0,
  "cutoffDate": "2025-08-17T22:11:42.000Z"
}
```

### Eroare de autentificare
```json
{
  "error": "Unauthorized"
}
```

### Eroare de metodă
```json
{
  "error": "Method not allowed"
}
```

## Programare Automată

Pentru rulare automată, această funcție poate fi apelată prin:

1. **Supabase pg_cron** (recomandat pentru consistență):
```sql
SELECT cron.schedule(
  'cleanup-unconfirmed-emails',
  '0 2 * * *', -- Zilnic la 2:00 AM
  'SELECT net.http_post(
    url := ''https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails'',
    headers := jsonb_build_object(
      ''Authorization'', ''Bearer '' || current_setting(''app.supabase.anon_key''),
      ''x-cleanup-secret'', current_setting(''app.cleanup.secret''),
      ''Content-Type'', ''application/json''
    ),
    body := ''{}''::jsonb
  );'
);
```

2. **Cron job extern**:
```bash
# Adaugă în crontab pentru rulare zilnică la 2:00 AM
0 2 * * * /usr/bin/curl -X POST "https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails" -H "Authorization: Bearer $SUPABASE_ANON_KEY" -H "x-cleanup-secret: $CLEANUP_SECRET"
```

3. **GitHub Actions** (pentru proiecte cu CI/CD):
```yaml
name: Daily Cleanup
on:
  schedule:
    - cron: '0 2 * * *' # Zilnic la 2:00 AM UTC
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup unconfirmed emails
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/cleanup-unconfirmed-emails" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "x-cleanup-secret: ${{ secrets.CLEANUP_SECRET }}"
```

## Monitorizare și Debugging

### Loguri Supabase
Funcția înregistrează activitatea în logurile Supabase Edge Functions:
- Timestamp-uri pentru începutul și sfârșitul operațiunilor
- Numărul de înregistrări găsite și șterse
- Erori de bază de date sau probleme de autentificare

### Acces loguri
```bash
npx supabase functions logs cleanup-unconfirmed-emails --follow
```

## Considerații de Securitate

1. **Secret de cleanup**: Funcția folosește constant-time comparison pentru a preveni timing attacks
2. **CORS**: Configurați doar domeniile necesare în `ALLOWED_ORIGINS`
3. **Rate limiting**: Considerați implementarea unui rate limiting la nivel de infrastructură
4. **Audit logging**: Toate operațiunile sunt înregistrate cu timestamp-uri pentru audit

## Deployment și Actualizare

### Deployment inițial
```bash
npx supabase functions deploy cleanup-unconfirmed-emails
```

### Actualizare secrete
```bash
npx supabase secrets set CLEANUP_SECRET="new-secret-key"
npx supabase secrets set ALLOWED_ORIGINS="https://coquinate.ro,https://coquinate.com"
```

### Testare locală
```bash
npx supabase functions serve cleanup-unconfirmed-emails --env-file .env
```

## Status de Deployment

- **Status**: ✅ ACTIVE
- **Versiune**: v3
- **Ultimul deployment**: 2025-08-24T22:11:42.000Z
- **ID funcție**: 729b97fa-beaf-428f-a5b2-2b7ac8cd5fcc