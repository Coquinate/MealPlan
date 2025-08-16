import type { NextApiRequest, NextApiResponse } from 'next';
import { logError, generateRequestId } from '@coquinate/shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = generateRequestId();

  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    await logError('Attempt to access test account creation in production', 'auth', 'medium', {
      route: '/api/create-test-account',
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
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Metodă neacceptată',
      message: 'Doar metoda POST este acceptată',
    });
  }

  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';

  try {
    // Call registration endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          household_size: 2,
          menu_type: 'omnivore',
          default_view_preference: 'RO',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();

      // Log registration failure
      await logError(
        `Test account registration failed: ${error.message || 'Unknown error'}`,
        'auth',
        'high',
        {
          email: testEmail,
          error,
          responseStatus: response.status,
          requestId,
        }
      );

      return res.status(400).json({
        error: 'Eroare înregistrare',
        message: 'Crearea contului de test a eșuat',
        details: error,
      });
    }

    const result = await response.json();

    console.log(`✅ Cont de test creat: ${testEmail} (Request ID: ${requestId})`);

    res.status(200).json({
      success: true,
      credentials: {
        email: testEmail,
        password: testPassword,
        message:
          'Contul de test a fost creat cu succes! Poți să te autentifici cu aceste credențiale.',
      },
      data: result,
      requestId,
    });
  } catch (error) {
    // Log critical error
    await logError(error as Error, 'auth', 'critical', {
      email: testEmail,
      operation: 'create_test_account',
      requestId,
    });

    console.error('❌ Test account creation error:', error);
    res.status(500).json({
      error: 'Eroare internă',
      message: 'A apărut o eroare la crearea contului de test. Încercați din nou.',
      requestId,
    });
  }
}
