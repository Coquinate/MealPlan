import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { logError, generateRequestId } from '@coquinate/shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = generateRequestId();

  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    await logError('Attempt to access user deletion in production', 'database', 'high', {
      route: '/api/delete-user',
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      requestId,
    });
    return res.status(403).json({
      error: 'Acces interzis',
      message: 'Acest endpoint este disponibil doar în mediul de dezvoltare',
    });
  }

  // Validate method
  if (req.method !== 'DELETE' && req.method !== 'GET') {
    return res.status(405).json({
      error: 'Metodă neacceptată',
      message: 'Doar metodele DELETE și GET sunt acceptate',
    });
  }

  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    await logError('Missing email parameter in user deletion request', 'database', 'low', {
      route: '/api/delete-user',
      query: req.query,
      requestId,
    });
    return res.status(400).json({
      error: 'Parametru lipsă',
      message: 'Parametrul email este necesar',
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    await logError('Missing Supabase configuration for user deletion', 'database', 'critical', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      requestId,
    });
    return res.status(500).json({
      error: 'Eroare configurare',
      message: 'Configurația Supabase nu este completă',
    });
  }

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // First, get the user ID from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      await logError(`Auth users list failed: ${authError.message}`, 'database', 'high', {
        email,
        authError: authError.message,
        requestId,
      });
      console.error('❌ Auth error:', authError);
      return res.status(500).json({
        error: 'Eroare autentificare',
        message: 'Nu s-au putut obține utilizatorii din Auth',
        details: authError.message,
      });
    }

    const userToDelete = authUsers?.users.find((u) => u.email === email);

    if (!userToDelete) {
      await logError(`User not found for deletion: ${email}`, 'database', 'medium', {
        email,
        totalUsers: authUsers?.users.length || 0,
        requestId,
      });
      return res.status(404).json({
        error: 'Utilizator negăsit',
        message: `Utilizatorul cu email-ul ${email} nu a fost găsit`,
      });
    }

    // Delete from public.users first (due to foreign key constraint)
    const { error: publicDeleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.id);

    if (publicDeleteError) {
      await logError(
        `Public users deletion failed: ${publicDeleteError.message}`,
        'database',
        'medium',
        {
          userId: userToDelete.id,
          email,
          error: publicDeleteError.message,
          requestId,
        }
      );
      console.warn('⚠️ Error deleting from public.users:', publicDeleteError);
      // Continue anyway, might not exist in public.users
    }

    // Delete from auth.users
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userToDelete.id);

    if (authDeleteError) {
      await logError(`Auth user deletion failed: ${authDeleteError.message}`, 'database', 'high', {
        userId: userToDelete.id,
        email,
        error: authDeleteError.message,
        requestId,
      });
      console.error('❌ Error deleting from auth.users:', authDeleteError);
      return res.status(500).json({
        error: 'Eroare ștergere',
        message: 'Nu s-a putut șterge utilizatorul din Auth',
        details: authDeleteError.message,
      });
    }

    console.log(
      `✅ Utilizator șters cu succes: ${email} (ID: ${userToDelete.id}) - Request ID: ${requestId}`
    );

    res.status(200).json({
      success: true,
      message: `Utilizatorul ${email} a fost șters cu succes`,
      deletedUser: {
        id: userToDelete.id,
        email: userToDelete.email,
      },
      requestId,
    });
  } catch (error) {
    // Log critical error
    await logError(error as Error, 'database', 'critical', {
      email,
      operation: 'delete_user',
      requestId,
    });

    console.error('❌ User deletion error:', error);
    res.status(500).json({
      error: 'Eroare internă',
      message: 'A apărut o eroare la ștergerea utilizatorului. Încercați din nou.',
      requestId,
    });
  }
}
