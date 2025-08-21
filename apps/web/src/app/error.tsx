'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation('common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-8 text-center space-y-6 bg-white rounded-lg shadow-lg">
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-error-100">
              <svg
                className="h-10 w-10 text-error-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text mb-2">{t('error.general.title')}</h1>
              <p className="text-text-secondary">
                {t('error.general.description')}
              </p>
            </div>

            <div className="bg-surface-elevated p-4 rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>{t('error.notFound.errorCode')}:</strong> 500
              </p>
              {error.digest && (
                <p className="text-xs text-text-tertiary mt-2 font-mono">
                  {t('error.boundary.errorId')}: {error.digest}
                </p>
              )}
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-left bg-surface-elevated p-4 rounded-md">
                <p className="text-xs font-mono text-error-600 break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              {t('error.boundary.tryAgain')}
            </button>

            <div className="flex space-x-3">
              <Link href="/dashboard" className="flex-1">
                <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  {t('error.notFound.backToMain')}
                </button>
              </Link>

              <Link href="/" className="flex-1">
                <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  {t('error.notFound.homePage')}
                </button>
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
              {t('error.boundary.persistMessage')}{' '}
              <a href="mailto:support@coquinate.com" className="text-primary hover:underline">
                support@coquinate.com
              </a>
              {error.digest && (
                <span>
                  {' '}
                  {t('error.boundary.mentionId')}: <code className="font-mono">{error.digest}</code>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}