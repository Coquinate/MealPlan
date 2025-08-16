import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@coquinate/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          setError('Nu aveți acces de administrator');
          return;
        }

        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Eroare la autentificare');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-surface">
      <div className="bg-admin-surface-raised p-8 rounded-card shadow-card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-admin-text">Coquinate Admin</h1>
          <p className="text-admin-text-secondary mt-2">Autentificare Administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-admin-text mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent bg-white text-admin-text"
              placeholder="admin@coquinate.ro"
              required
              autoComplete="email"
              data-testid="admin-email-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-admin-text mb-2">
              Parolă
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent bg-white text-admin-text"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              data-testid="admin-password-input"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
            data-testid="admin-login-button"
          >
            {isLoading ? 'Se autentifică...' : 'Autentificare'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin/forgot-password" className="text-sm text-admin-primary hover:underline">
            Ați uitat parola?
          </a>
        </div>
      </div>
    </div>
  );
}
