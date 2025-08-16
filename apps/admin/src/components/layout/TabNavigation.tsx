import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface Tab {
  id: string;
  path: string;
  icon: string;
  shortcut?: string;
}

/**
 * Tab navigation component with i18n support
 * Implements OKLCH colors and keyboard shortcuts
 */
export function TabNavigation() {
  const { t } = useTranslation('admin');
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: Tab[] = [
    { id: 'recipes', path: '/admin/recipes', icon: '🍽️', shortcut: 'alt+1' },
    { id: 'meal-plans', path: '/admin/meal-plans', icon: '📅', shortcut: 'alt+2' },
    { id: 'validation', path: '/admin/validation', icon: '✅', shortcut: 'alt+3' },
    { id: 'analytics', path: '/admin/analytics', icon: '📊', shortcut: 'alt+4' },
    { id: 'settings', path: '/admin/settings', icon: '⚙️', shortcut: 'alt+5' },
  ];

  // Handle keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        const tabIndex = parseInt(e.key, 10) - 1;
        if (tabIndex >= 0 && tabIndex < tabs.length) {
          e.preventDefault();
          const tab = tabs[tabIndex];
          navigate(tab.path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, tabs]);

  // Persist navigation state
  useEffect(() => {
    localStorage.setItem('admin-last-path', location.pathname);
  }, [location.pathname]);

  return (
    <nav className="px-8" role="navigation" aria-label={t('navigation.main')}>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              clsx(
                // Base styles
                'relative px-6 py-3 text-sm font-medium rounded-t-lg',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2',

                // Hover states
                'hover:bg-admin-surface hover:text-admin-primary',
                'dark:hover:bg-admin-dark-surface-raised dark:hover:text-admin-dark-text',

                // Active state with OKLCH colors
                isActive
                  ? [
                      'bg-admin-surface text-admin-primary',
                      'dark:bg-admin-dark-surface-raised dark:text-admin-dark-text',
                      'shadow-sm',
                      // Active indicator
                      'after:absolute after:bottom-0 after:left-0 after:right-0',
                      'after:h-[2px] after:bg-admin-primary',
                      'dark:after:bg-admin-dark-text',
                    ]
                  : [
                      'text-admin-text-secondary',
                      'dark:text-admin-dark-text-secondary',
                      'hover:text-admin-text dark:hover:text-admin-dark-text',
                    ]
              )
            }
            data-testid={`nav-tab-${tab.id}`}
            aria-label={`${t(`navigation.${tab.id}`)} ${tab.shortcut ? `(${tab.shortcut})` : ''}`}
            aria-current={location.pathname === tab.path ? 'page' : undefined}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">
                {tab.icon}
              </span>
              <span>{t(`navigation.${tab.id}`)}</span>
              {/* Show keyboard shortcut hint on hover */}
              {tab.shortcut && (
                <span
                  className={clsx(
                    'hidden lg:inline-block',
                    'text-xs px-1.5 py-0.5 rounded',
                    'bg-admin-surface dark:bg-admin-dark-surface',
                    'text-admin-text-secondary dark:text-admin-dark-text-secondary',
                    'opacity-0 group-hover:opacity-100 transition-opacity'
                  )}
                >
                  {tab.shortcut}
                </span>
              )}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
