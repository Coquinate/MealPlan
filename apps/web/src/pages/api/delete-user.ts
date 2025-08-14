import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // First, get the user ID from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(500).json({ error: authError.message });
    }

    const userToDelete = authUsers?.users.find((u) => u.email === email);

    if (!userToDelete) {
      return res.status(404).json({ error: `User ${email} not found in auth.users` });
    }

    // Delete from public.users first (due to foreign key constraint)
    const { error: publicDeleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.id);

    if (publicDeleteError) {
      console.error('Error deleting from public.users:', publicDeleteError);
      // Continue anyway, might not exist in public.users
    }

    // Delete from auth.users
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userToDelete.id);

    if (authDeleteError) {
      console.error('Error deleting from auth.users:', authDeleteError);
      return res.status(500).json({ error: authDeleteError.message });
    }

    res.status(200).json({
      success: true,
      message: `User ${email} deleted successfully`,
      deletedUser: {
        id: userToDelete.id,
        email: userToDelete.email,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
