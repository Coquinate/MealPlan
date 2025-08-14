'use client';

import React from 'react';
import { Card } from '@coquinate/ui';

/**
 * Maintenance Mode Page
 *
 * Displays when the app is in maintenance mode via MAINTENANCE_MODE environment variable
 * Shows Romanian maintenance message with estimated return time
 */
export default function MaintenancePage() {
  // Get maintenance info from environment variables
  const maintenanceMessage = process.env.MAINTENANCE_MESSAGE_RO || 'Aplicația este în mentenanță';
  const maintenanceEta = process.env.MAINTENANCE_ETA || '2 ore';
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@coquinate.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-warning-100">
              <svg
                className="h-10 w-10 text-warning-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text mb-2">În mentenanță</h1>
              <p className="text-text-secondary">{maintenanceMessage}</p>
            </div>

            <div className="bg-surface-elevated p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-text">🔧 Lucrăm pentru tine</p>
              <p className="text-sm text-text-secondary">
                Estimăm că revenim în aproximativ <strong>{maintenanceEta}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>

            <p className="text-sm text-text-secondary">Revenim în curând!</p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">🥘</span>
              </div>
              <span className="text-sm font-semibold text-primary">Coquinate</span>
            </div>

            <div className="text-xs text-text-secondary space-y-1">
              <p>Pentru întrebări urgente:</p>
              <p>
                <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">
                  {supportEmail}
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
