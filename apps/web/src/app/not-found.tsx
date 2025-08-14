'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@coquinate/ui';

/**
 * 404 Not Found Page
 *
 * Displays when user navigates to a route that doesn't exist
 * Includes Romanian text and navigation options back to main sections
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-warning-100">
              <span className="text-4xl">🔍</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text mb-2">Pagina nu a fost găsită</h1>
              <p className="text-text-secondary">
                Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
              </p>
            </div>

            <div className="bg-surface-elevated p-4 rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Cod eroare:</strong> 404
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full" size="lg">
                Înapoi la panoul principal
              </Button>
            </Link>

            <div className="flex space-x-3">
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Pagina principală
                </Button>
              </Link>

              <Link href="/auth/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Autentificare
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">🥘</span>
              </div>
              <span className="text-sm font-semibold text-primary">Coquinate</span>
            </div>

            <p className="text-xs text-text-secondary">
              Dacă crezi că aceasta este o eroare, contactează-ne la{' '}
              <a href="mailto:support@coquinate.com" className="text-primary hover:underline">
                support@coquinate.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
