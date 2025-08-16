# External APIs

## Gemini 2.0 Flash API (Updated 2025)

- **Purpose:** AI-powered recipe generation and meal plan creation
- **Documentation:** https://ai.google.dev/api/generate-content
- **Base URL(s):** https://generativelanguage.googleapis.com
- **Authentication:** API Key
- **Rate Limits:** Project tier-based (60 req/min default, scales with usage)
- **AI SDK Integration:** AI SDK 4.2 with @ai-sdk/google package

**Key Endpoints Used:**

- `POST /v1beta/models/gemini-2.0-flash:generateContent` - Recipe generation and validation
- `POST /v1beta/models/gemini-2.0-flash:streamGenerateContent` - Streaming responses

**AI SDK 4.2 Integration:**

```typescript
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

const aiModel = google('gemini-2.0-flash', {
  apiKey: process.env.GEMINI_API_KEY,
});
```

**Integration Notes:**

- Used for admin dashboard AI features (Stories 3.6, 3.11, 3.12, 3.13)
- Integrated via AI SDK 4.2 (not direct API calls)
- Supports message parts for future image processing
- Production-ready model (generally available)

**Environment Configuration:**

```bash
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash  # Updated from gemini-pro
```

## Resend API

- **Purpose:** Transactional email for shopping lists and notifications
- **Documentation:** https://resend.com/docs
- **Base URL(s):** https://api.resend.com
- **Authentication:** Bearer token
- **Rate Limits:** 100 emails/day (free), 10,000/month (paid)

**Key Endpoints Used:**

- `POST /emails` - Send shopping lists and receipts

**Integration Notes:** Better deliverability than SendGrid for Romanian market

## Stripe API

- **Purpose:** Payment processing for subscriptions
- **Documentation:** https://stripe.com/docs/api
- **Base URL(s):** https://api.stripe.com
- **Authentication:** Secret key
- **Rate Limits:** 100 requests/second

**Key Endpoints Used:**

- `POST /v1/checkout/sessions` - Create payment sessions
- `POST /v1/subscriptions` - Manage subscriptions
- `POST /v1/customers` - Customer management

**Integration Notes:** Full Romanian payment method support including local cards

## Upstash Redis API

- **Purpose:** Edge-compatible caching layer
- **Documentation:** https://docs.upstash.com/redis
- **Base URL(s):** Regional endpoints
- **Authentication:** REST token
- **Rate Limits:** Based on plan

**Key Endpoints Used:**

- REST API for cache operations
- Compatible with Deno edge runtime

**Integration Notes:** Serverless Redis perfect for Edge Functions

## OpenFoodFacts API

- **Purpose:** Nutritional data and ingredient information
- **Documentation:** https://world.openfoodfacts.org/data
- **Base URL(s):** https://world.openfoodfacts.org
- **Authentication:** None (open API)
- **Rate Limits:** Fair use policy

**Key Endpoints Used:**

- `GET /api/v2/product/{barcode}` - Get product nutrition data
- `GET /api/v2/search` - Search ingredients

**Integration Notes:** Fallback cascade: Local DB → OpenFoodFacts API → Manual entry
