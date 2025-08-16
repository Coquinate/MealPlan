import React from 'react';
import { useTranslation } from '@coquinate/i18n';
import { Card } from '@coquinate/ui';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function DashboardPage() {
  const { t } = useTranslation('admin');
  const { adminUser } = useAdminAuth();

  const stats = [
    { label: 'Rețete Active', value: '156', change: '+12', trend: 'up' },
    { label: 'Planuri Săptămână', value: '7', change: '0', trend: 'neutral' },
    { label: 'Utilizatori Activi', value: '1,234', change: '+56', trend: 'up' },
    { label: 'Rată Validare', value: '98%', change: '+2%', trend: 'up' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-admin-text dark:text-admin-dark-text">Dashboard</h2>
        <p className="text-admin-text-secondary dark:text-admin-dark-text-secondary mt-2">
          Bine ați venit, {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-admin-text-secondary dark:text-admin-dark-text-secondary">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-admin-text dark:text-admin-dark-text mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trend === 'up'
                    ? 'text-status-valid'
                    : stat.trend === 'down'
                      ? 'text-status-error'
                      : 'text-admin-text-secondary'
                }`}
              >
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-admin-text dark:text-admin-dark-text mb-4">
          Activitate Recentă
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-admin-border dark:border-admin-dark-border">
            <div>
              <p className="text-sm font-medium text-admin-text dark:text-admin-dark-text">
                Rețetă nouă adăugată: Sarmale tradiționale
              </p>
              <p className="text-xs text-admin-text-secondary dark:text-admin-dark-text-secondary">
                Acum 5 minute
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-admin-border dark:border-admin-dark-border">
            <div>
              <p className="text-sm font-medium text-admin-text dark:text-admin-dark-text">
                Plan de masă actualizat pentru Săptămâna 34
              </p>
              <p className="text-xs text-admin-text-secondary dark:text-admin-dark-text-secondary">
                Acum 1 oră
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-admin-text dark:text-admin-dark-text">
                Validare completă pentru publicare
              </p>
              <p className="text-xs text-admin-text-secondary dark:text-admin-dark-text-secondary">
                Acum 2 ore
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
