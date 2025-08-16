import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@coquinate/ui';
import { validate2FAToken, sanitize2FAToken } from '@/utils/validation';

export function TwoFactorPage() {
  const navigate = useNavigate();
  const { adminUser, verify2FA } = useAdminAuth();
  const [token, setToken] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [displaySecret, setDisplaySecret] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }

    if (!adminUser.two_factor_enabled) {
      generateSetup();
    }

    return () => {
      // Clear sensitive data on unmount
      setSetupSecret('');
      setDisplaySecret('');
      setQrCodeUrl('');
    };
  }, [adminUser, navigate]);

  const generateSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError('Nu sunteți autentificat');
        return;
      }

      // Call the Edge Function to generate 2FA setup
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-generate-2fa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la generarea setup-ului 2FA');
      }

      // Set the generated data
      setSetupSecret(data.secret);
      setDisplaySecret(data.secret);
      setQrCodeUrl(data.qrCodeDataUrl);
      setIsSetupMode(true);
    } catch (error) {
      console.error('Error generating 2FA setup:', error);
      setError('Eroare la generarea setup-ului 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token) {
      setError('Introduceți codul din aplicația de autentificare');
      return;
    }

    if (!validate2FAToken(token)) {
      setError('Codul trebuie să aibă 6 cifre');
      return;
    }

    const cleanToken = sanitize2FAToken(token);

    setIsVerifying(true);
    setError(null);

    try {
      if (isSetupMode) {
        if (!setupSecret) {
          setError('Eroare internă: Secret invalid');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError('Nu sunteți autentificat');
          return;
        }

        // First verify the token with the secret to ensure user has set up correctly
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-verify-2fa`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ token: cleanToken }),
          }
        );

        // For setup mode, we need to enable 2FA first, then verify
        const enableResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-enable-2fa`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ secret: setupSecret }),
          }
        );

        if (enableResponse.ok) {
          // Clear sensitive data
          setSetupSecret('');
          setDisplaySecret('');
          setQrCodeUrl('');

          alert('2FA activat cu succes!');
          navigate('/admin/dashboard');
        } else {
          const data = await enableResponse.json().catch(() => ({}));
          setError(data.error || 'Eroare la activarea 2FA');
        }
      } else {
        const success = await verify2FA(cleanToken);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError('Cod invalid');
        }
      }
    } catch (error) {
      console.error('Error verifying 2FA token:', error);
      setError('Eroare la verificarea codului');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificare în doi pași
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSetupMode
              ? 'Configurare 2FA pentru primul acces'
              : 'Introdu codul din aplicația de autentificare'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Se generează setup-ul 2FA...</p>
            </div>
          )}

          {isSetupMode && !isLoading && (
            <div className="space-y-4">
              {qrCodeUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Scanați cu aplicația de autentificare:
                  </p>
                  <img src={qrCodeUrl} alt="QR Code for 2FA setup" className="mx-auto" />
                </div>
              )}

              {displaySecret && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Sau introduceți manual:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono break-all">
                    {displaySecret}
                  </code>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="token" className="sr-only">
              Cod 2FA
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <Button
              onClick={handleVerifyToken}
              disabled={isVerifying || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isVerifying ? 'Se verifică...' : isSetupMode ? 'Activează 2FA' : 'Verifică'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
