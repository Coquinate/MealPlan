import React from 'react'
import { I18nProvider, useTranslation, useRomanianFormatters } from '@coquinate/i18n'
import { Button, Card } from '@coquinate/ui'

/**
 * Admin dashboard content with i18n integration
 */
function AdminContent() {
  const { t } = useTranslation('admin')
  const commonT = useTranslation('common').t
  const formatters = useRomanianFormatters()

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text">
            MealPlan - {t('dashboard.title')}
          </h1>
          <p className="text-text-secondary mt-2">
            {t('dashboard.subtitle')}
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recipes Card */}
          <Card variant="interactive" className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {t('recipes.title')}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {t('recipes.description')}
            </p>
            <Button variant="primary" size="sm">
              {t('recipes.manage')}
            </Button>
          </Card>

          {/* Meal Plans Card */}
          <Card variant="interactive" className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {t('mealPlans.title')}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {t('mealPlans.description')}
            </p>
            <Button variant="primary" size="sm">
              {t('mealPlans.create')}
            </Button>
          </Card>

          {/* Analytics Card */}
          <Card variant="interactive" className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {t('analytics.title')}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {t('analytics.description')}
            </p>
            <Button variant="primary" size="sm">
              {t('analytics.view')}
            </Button>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {commonT('label.status')}: i18n {commonT('message.success')}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>{commonT('time.today')}:</strong> {formatters.formatDate(new Date())}
            </div>
            <div>
              <strong>{commonT('label.time')}:</strong> {formatters.formatTime(new Date())}
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm">
              {commonT('button.back')}
            </Button>
            <Button variant="primary" size="sm">
              {commonT('button.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Root Admin App component with i18n provider wrapper
 */
export default function AdminApp() {
  return (
    <I18nProvider>
      <AdminContent />
    </I18nProvider>
  )
}