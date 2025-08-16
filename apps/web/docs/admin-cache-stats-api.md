# Admin Cache Stats API

The Admin Cache Stats API provides comprehensive cache statistics for monitoring AI cache performance, question frequencies, and cost savings.

## Endpoint

```
GET /api/admin/cache-stats
```

## Authentication

The endpoint requires admin authentication via one of the following methods:

### 1. API Key Header (Recommended)

```bash
curl -H "X-Admin-API-Key: YOUR_ADMIN_API_KEY" \
     https://your-domain.com/api/admin/cache-stats
```

### 2. Bearer Token

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
     https://your-domain.com/api/admin/cache-stats
```

## Environment Setup

Add to your `.env` file:

```env
ADMIN_API_KEY=your-secure-admin-api-key-minimum-32-characters
```

## Query Parameters

| Parameter  | Type    | Description                                                               | Default |
| ---------- | ------- | ------------------------------------------------------------------------- | ------- |
| `period`   | string  | Time period: `7d`, `30d`, `all`                                           | `30d`   |
| `category` | string  | Filter by question category: `substitution`, `duration`, `calories`, etc. | -       |
| `export`   | boolean | Download as JSON file                                                     | `false` |

## Response Format

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalQuestions": 150,
      "uniqueQuestions": 89,
      "cacheHitRate": 67.5,
      "costSavings": 0.0423,
      "totalCacheSize": 1048576,
      "totalCacheItems": 25
    },
    "performance": {
      "daily": [
        {
          "date": "2024-01-15",
          "hits": 45,
          "misses": 12,
          "hitRate": 78.9,
          "costSaved": 0.045
        }
      ],
      "monthly": [
        {
          "month": "2024-01",
          "hits": 1250,
          "misses": 380,
          "hitRate": 76.7,
          "costSaved": 1.25
        }
      ]
    },
    "topQuestions": [
      {
        "question": "Cu ce pot înlocui untul?",
        "count": 23,
        "category": "substitution",
        "lastAsked": "2024-01-15T14:30:00.000Z"
      }
    ],
    "cacheDistribution": [
      {
        "category": "substitution",
        "count": 45,
        "percentage": 35.2
      }
    ],
    "systemHealth": {
      "cacheUtilization": 25.6,
      "evictionRate": 2,
      "averageResponseTime": 250,
      "errorRate": 0.5
    }
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## Usage Examples

### Basic Stats Request

```bash
curl -H "X-Admin-API-Key: your-api-key" \
     https://your-domain.com/api/admin/cache-stats
```

### Filter by Time Period

```bash
curl -H "X-Admin-API-Key: your-api-key" \
     "https://your-domain.com/api/admin/cache-stats?period=7d"
```

### Filter by Category

```bash
curl -H "X-Admin-API-Key: your-api-key" \
     "https://your-domain.com/api/admin/cache-stats?category=substitution"
```

### Export as File

```bash
curl -H "X-Admin-API-Key: your-api-key" \
     "https://your-domain.com/api/admin/cache-stats?export=true" \
     -o "cache-stats-$(date +%Y-%m-%d).json"
```

### Combined Parameters

```bash
curl -H "X-Admin-API-Key: your-api-key" \
     "https://your-domain.com/api/admin/cache-stats?period=30d&category=duration&export=true"
```

## Rate Limiting

- **Limit**: 10 requests per minute per IP address
- **Headers**: Response includes rate limit headers:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized. Admin API key required."
}
```

### 405 Method Not Allowed

```json
{
  "success": false,
  "error": "Method not allowed"
}
```

### 429 Rate Limited

```json
{
  "success": false,
  "error": "Rate limit exceeded. Maximum 10 requests per minute.",
  "resetTime": 1642260000000
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Service temporarily unavailable"
}
```

## Response Field Descriptions

### Summary Fields

- `totalQuestions`: Total number of questions asked across all time
- `uniqueQuestions`: Number of unique question patterns identified
- `cacheHitRate`: Percentage of requests served from cache (0-100)
- `costSavings`: Estimated cost savings in USD from cache hits
- `totalCacheSize`: Current cache size in bytes
- `totalCacheItems`: Number of items currently in cache

### Performance Fields

- `daily`: Array of daily performance metrics for the last 30 days
- `monthly`: Array of monthly performance metrics for the last 12 months
- `hits`: Number of cache hits in the period
- `misses`: Number of cache misses in the period
- `hitRate`: Cache hit rate percentage for the period
- `costSaved`: Cost savings for the period in USD

### Top Questions Fields

- `question`: The original question text
- `count`: Number of times this question was asked
- `category`: Categorized type of question (substitution, duration, etc.)
- `lastAsked`: ISO timestamp of when this question was last asked

### Cache Distribution Fields

- `category`: Question category name
- `count`: Number of questions in this category
- `percentage`: Percentage of total questions this category represents

### System Health Fields

- `cacheUtilization`: Percentage of maximum cache size currently used
- `evictionRate`: Number of items evicted from cache (lifetime total)
- `averageResponseTime`: Average response time in milliseconds
- `errorRate`: Error rate percentage

## Categories

Questions are automatically categorized into these types:

- `substitution`: Ingredient substitution questions ("cu ce pot înlocui...")
- `duration`: Cooking time questions ("cât timp...")
- `calories`: Nutrition and calorie questions
- `servings`: Portion and serving size questions
- `difficulty`: Cooking difficulty questions
- `storage`: Storage and preservation questions
- `temperature`: Temperature and heat questions
- `techniques`: Cooking method questions
- `timeOfDay`: Meal timing questions
- `general`: Uncategorized questions

## Security Features

- **Authentication**: Multiple auth methods supported
- **Rate Limiting**: Prevents abuse with configurable limits
- **Access Logging**: All admin access is logged for security monitoring
- **Input Validation**: Query parameters are validated and sanitized
- **Error Handling**: Graceful error responses without sensitive data exposure

## Integration with Admin Dashboard

This endpoint is designed to be consumed by the admin dashboard component:

```typescript
// Example React component usage
const response = await fetch('/api/admin/cache-stats', {
  headers: {
    'X-Admin-API-Key': process.env.ADMIN_API_KEY,
  },
});

const { success, data } = await response.json();
if (success) {
  // Update dashboard with cache statistics
  setCacheStats(data);
}
```

## Monitoring and Alerts

Consider setting up monitoring for:

- Cache hit rate drops below 60%
- Cost savings trending downward
- High eviction rates indicating cache pressure
- Unusual patterns in question categories
- Rate limit violations indicating potential attacks

## Development vs Production

### Development Mode

- Detailed error messages in responses
- Console logging of admin access
- More verbose debugging information

### Production Mode

- Generic error messages for security
- Structured logging to monitoring services
- Enhanced security headers and validation
