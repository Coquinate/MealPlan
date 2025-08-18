import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@coquinate/ui';
import { useAdminStore } from '@/stores/adminStore';

export function QuickActions() {
  const { t } = useTranslation('admin');
  const { emergencyMode, toggleEmergencyMode } = useAdminStore();
  const [showCloneConfirm, setShowCloneConfirm] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [emergencyConfirmText, setEmergencyConfirmText] = useState('');

  const handleCloneLastWeek = async () => {
    if (!showCloneConfirm) {
      setShowCloneConfirm(true);
      return;
    }

    try {
      // TODO: Implement clone last week functionality
      console.log('Cloning last week...');
      // Call API to clone last week's meal plans
      setShowCloneConfirm(false);
    } catch (error) {
      console.error('Error cloning last week:', error);
    }
  };

  const handleEmergencyMode = () => {
    if (!showEmergencyConfirm) {
      setShowEmergencyConfirm(true);
      return;
    }

    if (emergencyConfirmText.toUpperCase() === 'EMERGENCY') {
      toggleEmergencyMode();
      setShowEmergencyConfirm(false);
      setEmergencyConfirmText('');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Clone Last Week Button */}
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCloneLastWeek}
          data-testid="clone-last-week-button"
        >
          📋 {t('quickActions.cloneLastWeek')}
        </Button>

        {showCloneConfirm && (
          <div className="absolute top-full mt-2 left-0 bg-admin-surface-raised dark:bg-admin-dark-surface-raised rounded-lg shadow-card p-4 z-10 w-64">
            <p className="text-sm text-admin-text dark:text-admin-dark-text mb-3">
              {t('quickActions.confirmClone')}
            </p>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCloneLastWeek}>
                {t('quickActions.confirmCloneYes')}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowCloneConfirm(false)}>
                {t('quickActions.cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Mode Toggle */}
      <div className="relative">
        <Button
          variant={emergencyMode ? 'secondary' : 'secondary'}
          size="sm"
          onClick={handleEmergencyMode}
          data-testid="emergency-mode-button"
        >
          🚨{' '}
          {emergencyMode ? t('quickActions.emergencyModeActive') : t('quickActions.emergencyMode')}
        </Button>

        {showEmergencyConfirm && (
          <div className="absolute top-full mt-2 left-0 bg-admin-surface-raised dark:bg-admin-dark-surface-raised rounded-lg shadow-card p-4 z-10 w-72">
            <p className="text-sm text-admin-text dark:text-admin-dark-text mb-3">
              {emergencyMode
                ? t('quickActions.confirmEmergencyDeactivate')
                : t('quickActions.confirmEmergencyActivate')}
            </p>
            {!emergencyMode && (
              <>
                <p className="text-xs text-admin-text-secondary dark:text-admin-dark-text-secondary mb-2">
                  {t('quickActions.enterEmergency')}
                </p>
                <input
                  type="text"
                  value={emergencyConfirmText}
                  onChange={(e) => setEmergencyConfirmText(e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-admin-border rounded mb-3"
                  placeholder="EMERGENCY"
                  autoFocus
                />
              </>
            )}
            <div className="flex gap-2">
              <Button
                variant={'secondary'}
                size="sm"
                onClick={handleEmergencyMode}
                disabled={!emergencyMode && emergencyConfirmText.toUpperCase() !== 'EMERGENCY'}
              >
                {emergencyMode ? t('quickActions.deactivate') : t('quickActions.activate')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowEmergencyConfirm(false);
                  setEmergencyConfirmText('');
                }}
              >
                {t('quickActions.cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <button
        className="text-admin-text-secondary hover:text-admin-text dark:text-admin-dark-text-secondary dark:hover:text-admin-dark-text p-2 rounded-lg hover:bg-admin-surface dark:hover:bg-admin-dark-surface"
        title={t('quickActions.keyboardShortcuts')}
        data-testid="keyboard-shortcuts-button"
      >
        ⌨️
      </button>
    </div>
  );
}
