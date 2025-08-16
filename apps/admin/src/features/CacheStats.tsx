import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Cache statistics response from API
 */
interface CacheStatistics {
  success: boolean;
  data: {
    summary: {
      totalQuestions: number;
      uniqueQuestions: number;
      cacheHitRate: number;
      costSavings: number;
      totalCacheSize: number;
      totalCacheItems: number;
    };
    performance: {
      daily: Array<{
        date: string;
        hits: number;
        misses: number;
        hitRate: number;
        costSaved: number;
      }>;
      monthly: Array<{
        month: string;
        hits: number;
        misses: number;
        hitRate: number;
        costSaved: number;
      }>;
    };
    topQuestions: Array<{
      question: string;
      count: number;
      category: string;
      lastAsked: string;
    }>;
    cacheDistribution: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    systemHealth: {
      cacheUtilization: number;
      evictionRate: number;
      averageResponseTime: number;
      errorRate: number;
    };
  };
  timestamp: string;
}

/**
 * Cache Statistics Dashboard Component
 * Displays comprehensive cache performance metrics for admin monitoring
 */
export function CacheStats() {
  const { t } = useTranslation('admin');
  const [stats, setStats] = useState<CacheStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [period, setPeriod] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  /**
   * Fetch cache statistics from the admin API
   */
  const fetchStats = async () => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/cache-stats?period=${period}`, {
        credentials: 'include', // Include cookies for session auth
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setStats(data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Failed to fetch cache stats:', err);
      setError(err instanceof Error ? err.message : t('cacheStats.error'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export cache data as JSON file
   */
  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/cache-stats?period=${period}&export=true`, {
        credentials: 'include', // Include cookies for session auth
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cache-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export cache stats:', err);
    }
  };

  /**
   * Get color coding for hit rate
   */
  const getHitRateColor = (hitRate: number): string => {
    if (hitRate >= 80) return 'text-green-600';
    if (hitRate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Format cache size to human readable format
   */
  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [period, autoRefresh]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-medium text-red-800">{t('cacheStats.error')}</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {t('cacheStats.actions.refresh')}
        </button>
      </div>
    );
  }

  // No data state
  if (!stats?.data) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <span className="text-4xl mb-4 block">📊</span>
        <h3 className="text-lg font-medium text-gray-600 mb-2">{t('cacheStats.noData')}</h3>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t('cacheStats.actions.refresh')}
        </button>
      </div>
    );
  }

  const { data } = stats;

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('cacheStats.title')}</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              {t('cacheStats.lastUpdated', { time: lastUpdated.toLocaleTimeString('ro-RO') })}
              {autoRefresh && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {t('cacheStats.autoRefreshActive')}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">{t('cacheStats.performance.daily')}</option>
            <option value="30d">{t('cacheStats.performance.monthly')}</option>
            <option value="all">{t('cacheStats.period.all')}</option>
          </select>

          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            {t('cacheStats.actions.refresh')}
          </label>

          {/* Manual refresh */}
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            {t('cacheStats.actions.refresh')}
          </button>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            {t('cacheStats.actions.exportData')}
          </button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className={`text-3xl font-bold ${getHitRateColor(data.summary.cacheHitRate)}`}>
            {data.summary.cacheHitRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">{t('cacheStats.summary.cacheHitRate')}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">
            ${data.summary.costSavings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">{t('cacheStats.summary.costSavings')}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600">{data.summary.totalQuestions}</div>
          <div className="text-sm text-gray-600">{t('cacheStats.summary.totalQuestions')}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-orange-600">{data.summary.uniqueQuestions}</div>
          <div className="text-sm text-gray-600">{t('cacheStats.summary.uniqueQuestions')}</div>
        </div>
      </div>

      {/* System health metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('cacheStats.systemHealth.title')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.systemHealth.cacheUtilization.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {t('cacheStats.systemHealth.cacheUtilization')}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.systemHealth.averageResponseTime}ms
            </div>
            <div className="text-sm text-gray-600">
              {t('cacheStats.systemHealth.averageResponseTime')}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {data.systemHealth.errorRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">{t('cacheStats.systemHealth.errorRate')}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.systemHealth.evictionRate}</div>
            <div className="text-sm text-gray-600">{t('cacheStats.systemHealth.evictionRate')}</div>
          </div>
        </div>
      </div>

      {/* Top questions */}
      {data.topQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('cacheStats.topQuestions.title')}
          </h3>
          <div className="space-y-3">
            {data.topQuestions.slice(0, 10).map((question, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {index + 1}. {question.question}
                  </div>
                  <div className="text-sm text-gray-600">
                    Categorie: {question.category} • Ultima dată:{' '}
                    {new Date(question.lastAsked).toLocaleDateString('ro-RO')}
                  </div>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                  <div className="text-lg font-semibold text-blue-600">{question.count}</div>
                  <div className="text-sm text-gray-500">întrebări</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache distribution */}
      {data.cacheDistribution.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('cacheStats.cacheDistribution.title')}
          </h3>
          <div className="space-y-3">
            {data.cacheDistribution.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: `hsl(${(index * 360) / data.cacheDistribution.length}, 70%, 60%)`,
                    }}
                  ></div>
                  <span className="font-medium capitalize">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{category.count}</div>
                  <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache size info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informații Cache</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {formatCacheSize(data.summary.totalCacheSize)}
            </div>
            <div className="text-sm text-gray-600">Dimensiune Totală Cache</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{data.summary.totalCacheItems}</div>
            <div className="text-sm text-gray-600">Elemente în Cache</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CacheStats;
