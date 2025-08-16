import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '@/stores/adminStore';
import clsx from 'clsx';

// Static helper functions moved outside component to prevent recreation
const formatDate = (date: Date) => {
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getNextThursday = (currentTime: Date) => {
  const next = new Date(currentTime);
  const daysUntilThursday = (4 - next.getDay() + 7) % 7 || 7;
  next.setDate(next.getDate() + daysUntilThursday);
  next.setHours(6, 0, 0, 0);
  return next;
};

const getWeekDateRange = (currentTime: Date) => {
  const startOfWeek = new Date(currentTime);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

/**
 * Status bar showing current week, next publish date, and validation status
 * Uses OKLCH colors for status indicators
 */
export function StatusBar() {
  const { t } = useTranslation('admin');
  const { currentWeek, nextPublishDate, validationStatus } = useAdminStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'bg-status-valid';
      case 'warning':
        return 'bg-status-warning';
      case 'error':
        return 'bg-status-error';
      default:
        return 'bg-status-unknown';
    }
  };

  const getStatusText = () => {
    switch (validationStatus) {
      case 'valid':
        return t('status.validationValid');
      case 'warning':
        return t('status.validationWarning');
      case 'error':
        return t('status.validationError');
      default:
        return t('status.validationUnknown');
    }
  };

  return (
    <div
      className={clsx(
        'bg-admin-surface dark:bg-admin-dark-surface',
        'border-b border-admin-border dark:border-admin-dark-border',
        'px-8 py-3'
      )}
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          {/* Current Week */}
          <div className="flex items-center gap-2">
            <span className="text-admin-text-secondary dark:text-admin-dark-text-secondary">
              {t('status.currentWeek')}:
            </span>
            <span className="font-medium text-admin-text dark:text-admin-dark-text">
              {t('status.week', { week: currentWeek })} ({getWeekDateRange(currentTime)})
            </span>
          </div>

          {/* Next Publish Date */}
          <div className="flex items-center gap-2">
            <span className="text-admin-text-secondary dark:text-admin-dark-text-secondary">
              {t('status.nextPublish')}:
            </span>
            <span className="font-medium text-admin-text dark:text-admin-dark-text">
              {formatDate(nextPublishDate || getNextThursday(currentTime))} {t('status.at')} 06:00
            </span>
          </div>

          {/* Validation Status */}
          <div className="flex items-center gap-2">
            <span className="text-admin-text-secondary dark:text-admin-dark-text-secondary">
              {t('status.validationStatus')}:
            </span>
            <span
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium text-white',
                'transition-colors duration-200',
                getStatusColor()
              )}
              data-testid="validation-status"
            >
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Current Time */}
        <div className="text-admin-text-secondary dark:text-admin-dark-text-secondary">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
