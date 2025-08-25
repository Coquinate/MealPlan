'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteNavigation, SiteFooter, ConfettiEffect } from '@coquinate/ui';
import { IconGift } from '@tabler/icons-react';
import { useTranslation } from '@coquinate/i18n';

export default function EmailConfirmationSuccessPage() {
  const { t } = useTranslation(['common', 'confirm']);
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

  // Parse URL parameters
  const isEarlyBird = searchParams.get('early-bird') === 'true';
  const signupOrder = searchParams.get('signup-order');
  const alreadyConfirmed = searchParams.get('already-confirmed') === 'true';

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/';
    }, 10000);

    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <>
      {showConfetti && <ConfettiEffect />}
      <div className="flex flex-col min-h-screen bg-background text-text">
        <SiteNavigation showLaunchBadge={true} comingSoonLabel={t('common:landing.coming_soon')} />
        
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-warm mb-4">
              {alreadyConfirmed ? 'Email deja confirmat!' : t('confirm:success.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-text-muted mb-8 max-w-lg mx-auto">
              {alreadyConfirmed 
                ? 'Emailul tău a fost deja confirmat anterior. Vei primi notificări când lansăm platforma.'
                : t('confirm:success.subtitle')
              }
            </p>

            {/* Early Bird Message */}
            {isEarlyBird && (
              <div className="bg-gradient-to-r from-primary-warm/10 to-accent-coral/10 border border-primary-warm/20 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <IconGift size={24} className="text-primary-warm" />
                  <h2 className="font-display text-xl font-bold text-primary-warm">
                    Oferta Early Bird!
                  </h2>
                </div>
                <p className="text-text font-medium">
                  {t('confirm:success.early_bird_message')}
                </p>
                {signupOrder && (
                  <p className="text-sm text-text-muted mt-2">
                    Ești utilizatorul #{signupOrder} înscris pe platformă.
                  </p>
                )}
              </div>
            )}

            {/* Regular User Benefits */}
            {!isEarlyBird && (
              <div className="bg-surface-secondary/50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <IconGift size={20} className="text-primary-warm" />
                  <h2 className="font-display text-lg font-bold text-primary-warm">
                    Beneficiul tău
                  </h2>
                </div>
                <p className="text-text">
                  Pentru că te-ai înscris pe lista de așteptare, vei primi <strong>un trial extins de la 3 la 7 zile</strong> plus acces prioritar la lansare.
                </p>
                {signupOrder && (
                  <p className="text-sm text-text-muted mt-2">
                    Ești utilizatorul #{signupOrder} înscris pe platformă.
                  </p>
                )}
              </div>
            )}

            {/* Call to Action */}
            <Link 
              href="/" 
              className="inline-block bg-gradient-to-r from-primary-warm to-primary-warm-light text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mb-6"
            >
              {t('confirm:success.cta')}
            </Link>

            {/* Auto-redirect countdown */}
            <p className="text-sm text-text-muted">
              {t('confirm:success.redirect_message', { count: countdown })}
            </p>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-surface-secondary/30 rounded-lg text-sm text-text-muted max-w-md mx-auto">
              <p>
                <strong>Ce urmează?</strong> Vei primi un email de confirmare și te vom anunța când platforma este gata pentru lansare.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter 
          copyrightText={t('common:app.title')} 
          privacyPolicyLabel="Politica de confidențialitate"
        />
      </div>
    </>
  );
}