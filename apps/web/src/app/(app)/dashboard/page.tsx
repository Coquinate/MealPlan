'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@coquinate/ui';
import { useTranslation } from '@coquinate/i18n';
import { useAuth } from '@coquinate/shared';

/**
 * Dashboard Page
 *
 * Protected page that shows main dashboard after authentication
 */
export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { isAuthenticated, isInitialized, signOut, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center">
        <div className="flex items-center space-x-2 text-primary">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>{t('message.loading')}</span>
        </div>
      </div>
    );
  }

  // Don't render until authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-space-lg py-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">🥘</span>
              </div>
              <h1 className="text-heading-xl font-bold text-primary">
                {t('dashboard.header.brand')}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">
                {user?.email
                  ? t('dashboard.header.greeting', { name: user.email })
                  : t('dashboard.header.greeting_fallback')}
              </span>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                {t('dashboard.header.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-space-lg py-space-2xl">
        <div className="grid gap-space-xl">
          {/* Welcome Section */}
          <Card className="p-space-xl text-center">
            <div className="mb-space-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-success-600 rounded-full flex items-center justify-center mx-auto mb-space-md">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-heading-2xl font-bold text-text mb-space-sm">
                {t('dashboard.welcome.title')}
              </h2>
              <p className="text-text-secondary max-w-md mx-auto">
                {t('dashboard.welcome.subtitle')}
              </p>
            </div>

            <div className="inline-flex items-center px-space-sm py-space-xs bg-primary-100 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-primary">
                {t('dashboard.welcome.status')}
              </span>
            </div>
          </Card>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-space-lg">
            <Card className="p-space-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {t('dashboard.features.mealPlanning.title')}
              </h3>
              <p className="text-text-secondary text-sm mb-space-md">
                {t('dashboard.features.mealPlanning.description')}
              </p>
              <Button variant="secondary" size="sm" disabled>
                {t('dashboard.features.mealPlanning.button')}
              </Button>
            </Card>

            <Card className="p-space-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {t('dashboard.features.shoppingList.title')}
              </h3>
              <p className="text-text-secondary text-sm mb-space-md">
                {t('dashboard.features.shoppingList.description')}
              </p>
              <Button variant="secondary" size="sm" disabled>
                {t('dashboard.features.shoppingList.button')}
              </Button>
            </Card>

            <Card className="p-space-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-space-md">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-heading-lg font-semibold text-text mb-space-sm">
                {t('dashboard.features.cookingAssistant.title')}
              </h3>
              <p className="text-text-secondary text-sm mb-space-md">
                {t('dashboard.features.cookingAssistant.description')}
              </p>
              <Button variant="secondary" size="sm" disabled>
                {t('dashboard.features.cookingAssistant.button')}
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
