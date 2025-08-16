// User profile management Edge Function
// Handles profile retrieval, updates, and household preferences management

import {
  corsHeaders,
  handleCors,
  errorResponse,
  successResponse,
  validateMethod,
  parseJsonBody,
  verifyAuthToken,
  createAuthenticatedClient,
} from '../_shared/auth.ts';
import {
  withErrorLogging,
  logEdgeFunctionError,
  logEdgeFunctionSuccess,
  generateEdgeRequestId,
} from '../_shared/monitoring.ts';

interface ProfileUpdateRequest {
  household_size?: number;
  menu_type?: 'vegetarian' | 'omnivore';
  default_view_preference?: 'week' | 'today';
}

interface UserProfile {
  id: string;
  email: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  subscription_status: string;
  has_active_trial: boolean;
  has_trial_gift_access: boolean;
  stripe_customer_id?: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Validate profile update data
 */
function validateProfileData(data: ProfileUpdateRequest): string | null {
  if (data.household_size !== undefined) {
    if (data.household_size < 1 || data.household_size > 6) {
      return 'Household size must be between 1 and 6';
    }
  }

  if (data.menu_type && !['vegetarian', 'omnivore'].includes(data.menu_type)) {
    return 'Menu type must be vegetarian or omnivore';
  }

  if (data.default_view_preference && !['week', 'today'].includes(data.default_view_preference)) {
    return 'Default view preference must be week or today';
  }

  return null;
}

/**
 * Get user profile
 */
async function getProfile(request: Request, requestId?: string): Promise<Response> {
  const authResult = await verifyAuthToken(request);
  if ('error' in authResult) {
    await logEdgeFunctionError(
      new Error('Auth verification failed'),
      'auth/profile',
      'auth',
      'medium',
      { authResult },
      undefined,
      requestId
    );
    return errorResponse(authResult.error, 401);
  }

  const { user } = authResult;

  try {
    const supabase = createAuthenticatedClient(authResult.token);

    const { data: profile, error } = await supabase
      .from('users')
      .select(
        `
        id,
        email,
        household_size,
        menu_type,
        subscription_status,
        has_active_trial,
        has_trial_gift_access,
        stripe_customer_id,
        trial_ends_at,
        created_at,
        updated_at
      `
      )
      .eq('id', user.id)
      .single();

    if (error) {
      await logEdgeFunctionError(
        new Error('Profile fetch error: ' + error.message),
        'auth/profile',
        'database',
        'high',
        { userId: user.id, error },
        user.id,
        requestId
      );
      return errorResponse(
        {
          error: 'profile_not_found',
          message: 'Profilul utilizatorului nu a fost găsit',
        },
        404
      );
    }

    // Log successful profile fetch
    logEdgeFunctionSuccess('auth/profile:getProfile', user.id, requestId, undefined, {
      email: profile.email,
      subscription_status: profile.subscription_status,
    });

    return successResponse({
      profile: profile as UserProfile,
    });
  } catch (error) {
    await logEdgeFunctionError(
      error as Error,
      'auth/profile',
      'database',
      'critical',
      { userId: user.id },
      user.id,
      requestId
    );
    return errorResponse(
      {
        error: 'internal_error',
        message: 'A apărut o eroare la încărcarea profilului',
      },
      500
    );
  }
}

/**
 * Update user profile
 */
async function updateProfile(request: Request, requestId?: string): Promise<Response> {
  const authResult = await verifyAuthToken(request);
  if ('error' in authResult) {
    return errorResponse(authResult.error, 401);
  }

  const { user } = authResult;

  // Parse request body
  const bodyResult = await parseJsonBody<ProfileUpdateRequest>(request);
  if ('error' in bodyResult) {
    return errorResponse(bodyResult.error, 400);
  }

  const updateData = bodyResult;

  // Validate update data
  const validationError = validateProfileData(updateData);
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
    const supabase = createAuthenticatedClient(authResult.token);

    // Update profile data
    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select(
        `
        id,
        email,
        household_size,
        menu_type,
        subscription_status,
        has_active_trial,
        has_trial_gift_access,
        stripe_customer_id,
        trial_ends_at,
        created_at,
        updated_at
      `
      )
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return errorResponse(
        {
          error: 'update_failed',
          message: 'Actualizarea profilului a eșuat',
        },
        400
      );
    }

    // Also update user metadata in Auth
    if (updateData.household_size || updateData.menu_type) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          household_size: updateData.household_size,
          menu_type: updateData.menu_type,
        },
      });

      if (metadataError) {
        console.error('Metadata update error:', metadataError);
        // Don't fail the whole request for metadata update errors
      }
    }

    // Log successful profile update
    logEdgeFunctionSuccess('auth/profile:updateProfile', user.id, requestId, undefined, {
      updateData,
      email: updatedProfile.email,
    });

    return successResponse({
      profile: updatedProfile as UserProfile,
      message: 'Profilul a fost actualizat cu succes',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(
      {
        error: 'internal_error',
        message: 'A apărut o eroare la actualizarea profilului',
      },
      500
    );
  }
}

/**
 * Delete user account
 */
async function deleteProfile(request: Request, requestId?: string): Promise<Response> {
  const authResult = await verifyAuthToken(request);
  if ('error' in authResult) {
    return errorResponse(authResult.error, 401);
  }

  const { user } = authResult;

  try {
    const supabase = createAuthenticatedClient(authResult.token);

    // Delete user profile (cascades should handle related data)
    const { error: profileError } = await supabase.from('users').delete().eq('id', user.id);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
      return errorResponse(
        {
          error: 'deletion_failed',
          message: 'Ștergerea profilului a eșuat',
        },
        400
      );
    }

    return successResponse({
      message: 'Contul a fost șters cu succes',
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    return errorResponse(
      {
        error: 'internal_error',
        message: 'A apărut o eroare la ștergerea contului',
      },
      500
    );
  }
}

/**
 * Main profile handler
 */
async function handleProfile(request: Request): Promise<Response> {
  const requestId = generateEdgeRequestId();

  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  // Route based on HTTP method
  switch (request.method) {
    case 'GET':
      return await getProfile(request, requestId);
    case 'PUT':
    case 'PATCH':
      return await updateProfile(request, requestId);
    case 'DELETE':
      return await deleteProfile(request, requestId);
    default:
      await logEdgeFunctionError(
        new Error('Method not allowed'),
        'auth/profile',
        'validation',
        'low',
        { method: request.method },
        undefined,
        requestId
      );
      return errorResponse(
        {
          error: 'method_not_allowed',
          message: `Method ${request.method} not allowed`,
        },
        405
      );
  }
}

// Edge Function handler with comprehensive logging
Deno.serve(withErrorLogging(handleProfile, 'auth/profile'));
