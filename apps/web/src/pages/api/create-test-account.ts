import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
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
      return res.status(400).json({ error });
    }

    const result = await response.json();

    res.status(200).json({
      success: true,
      credentials: {
        email: testEmail,
        password: testPassword,
        message: 'Account created successfully! You can now login with these credentials.',
      },
      data: result,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create test account' });
  }
}
