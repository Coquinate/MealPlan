import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(500).json({ error: authError.message });
    }

    // Get all users from public.users
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('id, email, household_size, menu_type, subscription_status');

    if (publicError) {
      console.error('Public users error:', publicError);
      return res.status(500).json({ error: publicError.message });
    }

    res.status(200).json({
      authUsers: authUsers?.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        confirmed_at: u.confirmed_at,
      })),
      publicUsers,
      count: {
        auth: authUsers?.users.length || 0,
        public: publicUsers?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
