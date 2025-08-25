'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteNavigation, SiteFooter, ConfettiEffect } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';

export default function ConfirmationSuccessPage() {
  const { t } = useTranslation(['common', 'landing']);
  const params = useParams();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const isEarlyBird = searchParams.get('early-bird') === 'true';
  const { token } = params;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/';
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <>
      <ConfettiEffect />
      <div className="flex flex-col min-h-screen bg-background text-text">
        <SiteNavigation showLaunchBadge={true} comingSoonLabel={t('nav.coming_soon')} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-primary mb-4">
              {t('confirm.success.title')}
            </h1>
            <p className="text-lg text-text-muted mb-8">
              {t('confirm.success.subtitle')}
            </p>
            {isEarlyBird && (
              <div className="bg-success-100 text-success-800 p-4 rounded-lg mb-8">
                <p className="font-semibold">{t('confirm.success.early_bird_message')}</p>
              </div>
            )}
            <Link href="/" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                {t('confirm.success.cta')}
            </Link>
            <p className="mt-4 text-sm text-text-muted">
              {t('confirm.success.redirect_message', { count: countdown })}
            </p>
          </div>
        </main>
        <SiteFooter copyrightText={t('footer.copyright')} privacyPolicyLabel={t('footer.privacy')} />
      </div>
    </>
  );
}
