import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { TabNavigation } from './TabNavigation';
import { StatusBar } from './StatusBar';
import { QuickActions } from './QuickActions';
import { useThemeStore } from '@/stores/themeStore';
import clsx from 'clsx';

interface AdminShellProps {
  children: ReactNode;
}

/**
 * Admin shell layout component
 * Desktop-first design optimized for 1920x1080 screens
 * Implements OKLCH color system with dark mode support
 */
export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation('admin');
  const { adminUser, signOut } = useAdminAuth();
  const { theme, toggleTheme } = useThemeStore();

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Ensure desktop-first layout with throttled resize listener
  useEffect(() => {
    const checkViewport = () => {
      if (window.innerWidth < 1024) {
        console.warn('Admin dashboard is optimized for desktop screens (min-width: 1024px)');
      }
    };

    // Initial check
    checkViewport();

    // Throttled resize listener
    let timeoutId: NodeJS.Timeout;
    const throttledCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkViewport, 200);
    };

    window.addEventListener('resize', throttledCheck);
    return () => {
      window.removeEventListener('resize', throttledCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={clsx(
        'min-h-screen min-w-[1024px] overflow-x-auto',
        'bg-admin-surface dark:bg-admin-dark-surface',
        'transition-colors duration-200'
      )}
    >
      {/* Header */}
      <header
        className={clsx(
          'sticky top-0 z-50',
          'bg-admin-surface-raised dark:bg-admin-dark-surface-raised',
          'border-b border-admin-border dark:border-admin-dark-border',
          'shadow-sm'
        )}
      >
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1
                className={clsx(
                  'text-2xl font-display font-bold',
                  'text-admin-text dark:text-admin-dark-text'
                )}
              >
                Coquinate Admin
              </h1>
              <QuickActions />
            </div>

            <div className="flex items-center gap-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-admin-surface hover:dark:bg-admin-dark-surface',
                  'text-admin-text-secondary dark:text-admin-dark-text-secondary'
                )}
                data-testid="theme-toggle"
                aria-label={t('theme.toggle')}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* User Info */}
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'text-sm font-medium',
                    'text-admin-text-secondary dark:text-admin-dark-text-secondary'
                  )}
                >
                  {adminUser?.role === 'super_admin' ? '👑' : '👤'}
                  <span className="ml-1">{t(`roles.${adminUser?.role}`)}</span>
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={signOut}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  'hover:bg-status-error hover:bg-opacity-10',
                  'text-admin-text-secondary hover:text-status-error',
                  'dark:text-admin-dark-text-secondary dark:hover:text-status-error'
                )}
                data-testid="admin-logout-button"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>

        <TabNavigation />
      </header>

      {/* Status Bar */}
      <StatusBar />

      {/* Main Content Area - Desktop Optimized */}
      <main
        className={clsx(
          'px-8 py-6',
          'min-h-[calc(100vh-180px)]' // Account for header and status bar
        )}
      >
        <div
          className={clsx(
            'mx-auto',
            'w-full max-w-[1920px]', // Optimized for 1920px width
            'xl:px-8' // Extra padding on very large screens
          )}
        >
          {/* Content Grid - Responsive but desktop-first */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">{children}</div>
          </div>
        </div>
      </main>

      {/* Footer for debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <footer
          className={clsx(
            'fixed bottom-0 right-0 p-2',
            'text-xs text-admin-text-secondary dark:text-admin-dark-text-secondary',
            'bg-admin-surface-raised dark:bg-admin-dark-surface-raised',
            'border-t border-l border-admin-border dark:border-admin-dark-border',
            'rounded-tl-lg'
          )}
        >
          <div>
            Viewport:{' '}
            {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
          </div>
          <div>Theme: {theme}</div>
        </footer>
      )}
    </div>
  );
}
