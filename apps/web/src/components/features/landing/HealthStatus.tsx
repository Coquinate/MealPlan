import React, { useState, useEffect } from 'react';
import { useTranslation } from '@coquinate/i18n';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime: number;
    };
    supabase: {
      status: 'up' | 'down';
    };
  };
  environment: 'production' | 'preview' | 'development';
}

/**
 * Health Status Component
 *
 * Displays real-time system health status with:
 * - Database connectivity
 * - Supabase status
 * - Visual indicators
 * - Auto-refresh every 30 seconds
 */
export const HealthStatus: React.FC = () => {
  const { t } = useTranslation('common');
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/health');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return 'text-text-secondary';
    if (error || !health) return 'text-red-600';

    switch (health.status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return <div className="inline-block w-2 h-2 rounded-full bg-text-secondary animate-pulse" />;
    }

    if (error || !health) {
      return <div className="inline-block w-2 h-2 rounded-full bg-red-600" />;
    }

    switch (health.status) {
      case 'healthy':
        return <div className="inline-block w-2 h-2 rounded-full bg-green-600" />;
      case 'degraded':
        return <div className="inline-block w-2 h-2 rounded-full bg-yellow-600" />;
      case 'unhealthy':
        return <div className="inline-block w-2 h-2 rounded-full bg-red-600" />;
      default:
        return <div className="inline-block w-2 h-2 rounded-full bg-text-secondary" />;
    }
  };

  const getStatusText = () => {
    if (loading) return t('health.checking');
    if (error || !health) return t('health.status_disconnected');

    switch (health.status) {
      case 'healthy':
        return t('health.status_connected');
      case 'degraded':
        return t('health.status_degraded');
      case 'unhealthy':
        return t('health.status_disconnected');
      default:
        return t('health.status_disconnected');
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs text-text-secondary">
      {getStatusIcon()}
      <span className={getStatusColor()}>{getStatusText()}</span>
    </div>
  );
};
