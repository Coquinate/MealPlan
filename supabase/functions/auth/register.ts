// Custom registration Edge Function with household preferences
// Handles email/password registration and collects household metadata

import {
  corsHeaders,
  handleCors,
  errorResponse,
  successResponse,
  validateMethod,
  parseJsonBody,
  createServiceClient,
} from '../_shared/auth.ts';
import {
  withErrorLogging,
  logEdgeFunctionError,
  logEdgeFunctionSuccess,
  generateEdgeRequestId,
} from '../_shared/monitoring.ts';

interface RegisterRequest {
  email: string;
  password: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  default_view_preference?: 'RO' | 'EN';
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
  };
  message: string;
}

/**
 * Validate registration request data
 */
function validateRegistrationData(data: RegisterRequest): string | null {
  if (!data.email || !data.email.includes('@')) {
    return 'Valid email address required';
  }

  if (!data.password || data.password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!data.household_size || data.household_size < 1 || data.household_size > 6) {
    return 'Household size must be between 1 and 6';
  }

  if (!data.menu_type || !['vegetarian', 'omnivore'].includes(data.menu_type)) {
    return 'Menu type must be vegetarian or omnivore';
  }

  if (data.default_view_preference && !['RO', 'EN'].includes(data.default_view_preference)) {
    return 'Default view preference must be RO or EN';
  }

  return null;
}

/**
 * Create user profile with household preferences
 */
async function createUserProfile(
  userId: string,
  email: string,
  preferences: RegisterRequest,
  requestId?: string
) {
  const supabase = createServiceClient();

  try {
    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      hashed_password: 'managed_by_supabase_auth', // Password is managed by Supabase Auth
      household_size: preferences.household_size,
      menu_type: preferences.menu_type,
      subscription_status: 'trial',
      has_active_trial: true,
      has_trial_gift_access: false,
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
      default_view_preference: preferences.default_view_preference || 'RO',
      guest_mode_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      await logEdgeFunctionError(
        new Error('Failed to create user profile: ' + error.message),
        'auth/register',
        'database',
        'high',
        { userId, email, error },
        userId,
        requestId
      );
      throw new Error('Failed to create user profile');
    }

    // Log successful profile creation
    logEdgeFunctionSuccess('auth/register:createUserProfile', userId, requestId, undefined, {
      email,
      household_size: preferences.household_size,
      menu_type: preferences.menu_type,
    });

    return true;
  } catch (error) {
    await logEdgeFunctionError(
      error as Error,
      'auth/register',
      'database',
      'critical',
      { userId, email, preferences: { ...preferences, password: '[REDACTED]' } },
      userId,
      requestId
    );
    throw error;
  }
}

/**
 * Main registration handler
 */
async function handleRegistration(request: Request): Promise<Response> {
  const requestId = generateEdgeRequestId();
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  // Validate method
  const methodError = validateMethod(request, ['POST']);
  if (methodError) {
    return errorResponse(methodError, 405);
  }

  // Parse request body
  const bodyResult = await parseJsonBody<RegisterRequest>(request);
  if ('error' in bodyResult) {
    return errorResponse(bodyResult.error, 400);
  }

  const registrationData = bodyResult;

  // Validate registration data
  const validationError = validateRegistrationData(registrationData);
  if (validationError) {
    return errorResponse(
      {
        error: 'validation_error',
        message: validationError,
      },
      400
    );
  }

  try {
    const supabase = createServiceClient();

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: registrationData.email,
      password: registrationData.password,
      email_confirm: true, // Auto-confirm for development
      user_metadata: {
        household_size: registrationData.household_size,
        menu_type: registrationData.menu_type,
        default_view_preference: registrationData.default_view_preference || 'RO',
      },
    });

    if (authError) {
      // Log auth error with context
      await logEdgeFunctionError(
        authError,
        'auth/register',
        'auth',
        authError.message.includes('already registered') ? 'medium' : 'high',
        { email: registrationData.email, authError: authError.message },
        undefined,
        requestId
      );

      // Handle common registration errors
      if (authError.message.includes('already registered')) {
        return errorResponse(
          {
            error: 'email_exists',
            message: 'Un cont cu această adresă de email există deja',
          },
          409
        );
      }

      return errorResponse(
        {
          error: 'registration_failed',
          message: 'Înregistrarea a eșuat. Încercați din nou.',
        },
        400
      );
    }

    if (!authData.user) {
      return errorResponse(
        {
          error: 'registration_failed',
          message: 'Înregistrarea a eșuat. Încercați din nou.',
        },
        400
      );
    }

    // Create user profile in users table
    await createUserProfile(authData.user.id, registrationData.email, registrationData, requestId);

    // Log successful registration
    logEdgeFunctionSuccess('auth/register', authData.user.id, requestId, undefined, {
      email: registrationData.email,
      household_size: registrationData.household_size,
      menu_type: registrationData.menu_type,
      trial_created: true,
    });

    return successResponse(
      {
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        message: 'Contul a fost creat cu succes. Vă puteți autentifica acum.',
      } as RegisterResponse,
      201
    );
  } catch (error) {
    // Log critical registration error
    await logEdgeFunctionError(
      error as Error,
      'auth/register',
      'auth',
      'critical',
      {
        email: registrationData.email,
        requestData: { ...registrationData, password: '[REDACTED]' },
      },
      undefined,
      requestId
    );

    return errorResponse(
      {
        error: 'internal_error',
        message: 'A apărut o eroare internă. Încercați din nou.',
      },
      500
    );
  }
}

// Edge Function handler with comprehensive logging
Deno.serve(withErrorLogging(handleRegistration, 'auth/register'));
