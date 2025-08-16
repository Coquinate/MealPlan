# Error Boundary System - Documentație

## Prezentare generală

Sistemul de Error Boundaries pentru Coquinate oferă:

- **Capturarea erorilor** din componente React în mod granular
- **Alertele instantanee** pentru administratori via Discord și email
- **Logging structurat** cu ID-uri de corelare pentru tracking
- **Mesaje user-friendly** în română pentru utilizatori
- **Mecanisme de retry** automate pentru erori temporare
- **Debugging tools** pentru dezvoltare

## Componente disponibile

### 1. RootErrorBoundary

**Utilizare**: Error boundary la nivel de aplicație care capturează toate erorile nehandlate.

**Locație**: Deja integrat în `app/layout.tsx`

**Caracteristici**:

- Capturează toate erorile React din aplicație
- Trimite alerte critice pentru erori la nivel de aplicație
- Afișează UI de recovery cu opțiuni multiple
- Generează ID-uri unice pentru tracking

### 2. AuthErrorBoundary

**Utilizare**: Error boundary specializat pentru componente de autentificare.

```tsx
import { AuthErrorBoundary } from '@/components/error-boundaries';

// Utilizare de bază
<AuthErrorBoundary>
  <LoginForm />
</AuthErrorBoundary>

// Cu handler custom
<AuthErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Handler custom pentru erori auth
    console.log('Auth error:', errorId);
  }}
>
  <SignUpForm />
</AuthErrorBoundary>
```

**Caracteristici**:

- Mapează erorile Supabase la mesaje românești
- Detectează tipul erorilor de autentificare
- Oferă contextual recovery options

### 3. ComponentErrorBoundary

**Utilizare**: Error boundary granular pentru componente individuale.

```tsx
import { ComponentErrorBoundary } from '@/components/error-boundaries';

// Utilizare de bază
<ComponentErrorBoundary componentName="PaymentForm">
  <PaymentComponent />
</ComponentErrorBoundary>

// Cu configurație avansată
<ComponentErrorBoundary
  componentName="ShoppingCart"
  severity="high"
  showErrorDetails={true}
  onError={(error, errorInfo, errorId) => {
    // Handler custom
  }}
>
  <ShoppingCartComponent />
</ComponentErrorBoundary>
```

**Caracteristici**:

- Determină severitatea automată bazată pe tipul erorii
- UI compact pentru erori de componente
- Retry limitat (3 încercări maxim)
- Context specific pentru logging

## Hook-uri disponibile

### useComponentErrorBoundary

Pentru gestionarea programatică a erorilor în componente funcționale.

```tsx
import { useComponentErrorBoundary } from '@/components/error-boundaries';

function MyComponent() {
  const { error, errorId, hasError, captureError, resetError } =
    useComponentErrorBoundary('MyComponent');

  const handleAsyncOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error as Error, {
        operation: 'async_payment',
        userId: currentUser?.id,
      });
    }
  };

  if (hasError) {
    return (
      <div>
        <p>Eroare: {error?.message}</p>
        <p>ID: {errorId}</p>
        <button onClick={resetError}>Încearcă din nou</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleAsyncOperation}>Operație riscantă</button>
    </div>
  );
}
```

## Severitate erorilor

Sistemul determină automată severitatea bazată pe conținutul erorii:

### Critical

- Erori de chunk loading
- Erori de script/network
- Erori în flow-uri de payment/auth

### High

- Erori de render React
- Erori de hook-uri
- Erori de router

### Medium

- Erori de props/state
- Erori de context
- Erori temporare API

### Low

- Erori necunoscute
- Erori minore de validare

## Alertele și logging-ul

### Alertele instantanee

Pentru erorile `critical` și `high`, sistemul trimite automat:

- **Discord webhook** la canalul de monitorizare
- **Email alerts** la echipa de dezvoltare
- **Dashboard notifications** în admin panel

### Logging structurat

Toate erorile sunt logate cu:

```typescript
{
  errorId: "error_1638360000000_abc123",
  componentName: "PaymentForm",
  severity: "high",
  timestamp: "2025-01-15T10:30:00.000Z",
  userId: "user_123",
  url: "/checkout",
  userAgent: "Mozilla/5.0...",
  errorMessage: "Payment processing failed",
  stack: "Error: Payment processing failed\n    at...",
  additionalContext: {
    paymentAmount: 2999,
    paymentMethod: "card"
  }
}
```

## Exemple de implementare

### 1. Componente de plată

```tsx
<ComponentErrorBoundary componentName="StripePayment" severity="critical">
  <StripeElements>
    <PaymentForm />
  </StripeElements>
</ComponentErrorBoundary>
```

### 2. Dashboard utilizator

```tsx
<ComponentErrorBoundary
  componentName="UserDashboard"
  severity="medium"
  fallback={(error, errorId, resetError) => (
    <DashboardErrorFallback error={error} errorId={errorId} onRetry={resetError} />
  )}
>
  <UserDashboard />
</ComponentErrorBoundary>
```

### 3. Pagini de autentificare

```tsx
<AuthErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Log additional auth context
    analytics.track('auth_error', {
      errorId,
      page: 'login',
      userAttempt: attempt,
    });
  }}
>
  <LoginPage />
</AuthErrorBoundary>
```

## Best practices

### 1. Plasarea Error Boundaries

```tsx
// ✅ Bun - la nivelul paginii
<ComponentErrorBoundary componentName="CheckoutPage">
  <CheckoutPageContent />
</ComponentErrorBoundary>

// ✅ Bun - în jurul componentelor critice
<ComponentErrorBoundary componentName="PaymentProcessor">
  <PaymentForm />
</ComponentErrorBoundary>

// ❌ Rău - prea granular
<ComponentErrorBoundary componentName="Button">
  <Button>Click me</Button>
</ComponentErrorBoundary>
```

### 2. Naming convention

```tsx
// ✅ Bun - nume descriptive
<ComponentErrorBoundary componentName="UserProfileForm">
<ComponentErrorBoundary componentName="RecipeSearchResults">
<ComponentErrorBoundary componentName="ShoppingCartCheckout">

// ❌ Rău - nume vague
<ComponentErrorBoundary componentName="Component">
<ComponentErrorBoundary componentName="Thing">
```

### 3. Context suplimentar

```tsx
// ✅ Bun - adaugă context relevant
const { captureError } = useComponentErrorBoundary('DataTable');

try {
  await fetchData();
} catch (error) {
  captureError(error as Error, {
    operation: 'data_fetch',
    filters: currentFilters,
    pageSize,
    userId: user?.id,
  });
}
```

### 4. Testing

```tsx
// Testează comportamentul error boundary-ului
it('should handle payment errors gracefully', () => {
  const ThrowingPayment = () => {
    throw new Error('Payment failed');
  };

  render(
    <ComponentErrorBoundary componentName="PaymentTest">
      <ThrowingPayment />
    </ComponentErrorBoundary>
  );

  expect(screen.getByText('Eroare în componenta PaymentTest')).toBeInTheDocument();
  expect(screen.getByText('Payment failed')).toBeInTheDocument();
});
```

## Monitoring și debugging

### 1. Error IDs

Fiecare eroare primește un ID unic în formatul:

```
error_1638360000000_abc123
```

Acest ID poate fi folosit pentru:

- Tracking în logs
- Referință în support tickets
- Corelarea între client și server

### 2. Development tools

În modul development, error boundaries afișează:

- Stack trace complet
- Props și state sanitizate
- Component stack
- Debugging controls

### 3. Production monitoring

În producție, monitorizarea include:

- Real-time alerts în Discord
- Email notifications
- Dashboard metrics
- Error correlation tracking

## Configurare

Error boundaries folosesc același sistem de configurare ca și logging-ul:

```env
# Discord webhook pentru alerte
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Email pentru alerte
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@coquinate.com
```

Pentru mai multe detalii, vezi documentația systemului de logging în `packages/shared/src/utils/`.
