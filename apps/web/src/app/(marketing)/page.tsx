'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';
import { HealthStatus } from '../../components/features/landing/HealthStatus';

/**
 * Landing Page Component
 *
 * Main entry point that demonstrates all infrastructure integration:
 * - Design system components (Card, Button)
 * - i18n with Romanian translations
 * - Navigation to auth system
 * - Health check display
 * - SEO optimization
 */
export default function LandingPage() {
  const router = useRouter();
  const { t, ready } = useTranslation('common');

  // Debug: Log i18n status
  React.useEffect(() => {
    console.log('i18n ready:', ready);
    console.log('t function:', t);
    console.log('Test translation:', t('landing.tagline'));
  }, [ready, t]);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleLoginClick = async () => {
    setIsNavigating(true);
    try {
      router.push('/auth/login');
    } catch (error) {
      console.error('Navigation failed:', error);
      setIsNavigating(false);
    }
    // Note: setIsNavigating(false) is not needed on success as the page will unmount
  };

  // Fallback translations when i18n is not ready
  const translations: Record<string, string> = {
    'landing.tagline': 'Planifică mesele tale cu ușurință',
    'landing.coming_soon': 'În curând',
    'landing.login_button': 'Autentificare',
    'landing.welcome_message': 'Bine ai venit la Coquinate',
    'landing.system_ready': 'Sistem verificat și pregătit pentru utilizare',
    'landing.feature1.title': 'Planificare Inteligentă',
    'landing.feature1.description':
      'Planifică mesele tale cu ușurință și optimizează lista de cumpărături',
    'landing.feature2.title': 'Cumpărături Smart',
    'landing.feature2.description':
      'Liste de cumpărături generate automat și optimizate pentru buget',
    'landing.feature3.title': 'Asistent Gătit',
    'landing.feature3.description':
      'Instrucțiuni pas cu pas și cronometru pentru prepararea perfectă',
    'message.loading': 'Se încarcă...',
  };

  const getText = (key: string) => {
    if (ready) {
      return t(key);
    }
    return translations[key] || key;
  };

  return (
    <>
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-romanian-food.png"
            alt="Mâncare românească tradițională"
            fill
            className="object-cover"
            quality={95}
            priority
            sizes="100vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl px-space-md">
          <div className="text-center mb-space-2xl">
            <div className="inline-flex items-center space-x-space-sm mb-space-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm bg-white/10">
                <span className="text-2xl font-bold text-white">🥘</span>
              </div>
              <h1 className="text-heading-4xl font-bold text-white drop-shadow-lg">Coquinate</h1>
            </div>

            <p className="text-heading-2xl text-white/90 mb-space-lg max-w-3xl mx-auto drop-shadow-md font-medium">
              {getText('landing.tagline')}
            </p>

            <div className="inline-flex items-center px-space-md py-space-sm bg-white/20 backdrop-blur-md rounded-full mb-space-xl border border-white/30">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-3"></div>
              <span className="text-lg font-medium text-white">
                {getText('landing.coming_soon')}
              </span>
            </div>

            {/* CTA Button in Hero */}
            <Button
              onClick={handleLoginClick}
              size="lg"
              className="px-space-3xl py-space-lg text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 bg-primary hover:bg-primary-600 border-2 border-white/20 backdrop-blur-sm"
              loading={isNavigating}
              disabled={isNavigating}
            >
              {isNavigating ? (
                <div className="flex items-center space-x-space-sm">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{getText('message.loading')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-space-sm">
                  <span>{getText('landing.login_button')}</span>
                  <span className="text-2xl">→</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </section>

      <main className="bg-gradient-to-br from-primary-50 via-surface to-primary-100 py-space-3xl">
        <div className="w-full max-w-4xl mx-auto px-space-md">
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-space-lg mb-space-2xl">
            <Card
              variant="elevated"
              className="text-center p-space-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-success to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {getText('landing.feature1.title')}
              </h3>
              <p className="text-text-secondary">{getText('landing.feature1.description')}</p>
            </Card>

            <Card
              variant="elevated"
              className="text-center p-space-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {getText('landing.feature2.title')}
              </h3>
              <p className="text-text-secondary">{getText('landing.feature2.description')}</p>
            </Card>

            <Card
              variant="elevated"
              className="text-center p-space-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-error to-error-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {getText('landing.feature3.title')}
              </h3>
              <p className="text-text-secondary">{getText('landing.feature3.description')}</p>
            </Card>
          </div>

          {/* Health Status Section */}
          <div className="text-center">
            <Card
              variant="elevated"
              className="inline-block p-space-xl bg-gradient-to-r from-primary-50 to-surface border-primary/20"
            >
              <div className="mb-space-lg">
                <h2 className="text-heading-2xl font-bold text-primary mb-space-sm">
                  {getText('landing.welcome_message')}
                </h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  {getText('landing.system_ready')}
                </p>
              </div>

              <div className="mt-space-md">
                <HealthStatus />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
