import React from 'react';
import { I18nProvider, useCommonTranslations } from '@coquinate/i18n';
import { Button } from '@coquinate/ui';

/**
 * Main component that demonstrates i18n provider integration
 */
function AppContent() {
  const { t } = useCommonTranslations();

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MealPlan - Web App</h1>

        <div className="bg-white rounded-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {t('label.status')}: i18n {t('message.success')}
          </h2>

          <div className="flex gap-4">
            <Button variant="primary">{t('button.save')}</Button>
            <Button variant="secondary">{t('button.cancel')}</Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">{t('message.loading')}</p>
            <p className="text-sm text-gray-600 mt-2">
              {t('time.today')} - i18n working correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Root App component with i18n provider wrapper
 */
export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
