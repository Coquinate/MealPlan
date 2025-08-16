/**
 * Example component showing AI cache analytics dashboard
 * This demonstrates how to use the analytics system in React components
 */

import React from 'react';
import { useAIAnalytics, useCacheEffectiveness } from '../../hooks/useAIAnalytics';

export function CacheAnalyticsDashboard() {
  const {
    data: analytics,
    loading,
    error,
    refresh,
    exportData,
    hitRate,
    totalSavings,
    totalQuestions,
    totalRecipes,
  } = useAIAnalytics({
    refreshInterval: 30000, // 30 seconds
    topQuestionsLimit: 5,
    realTimeUpdates: true,
  });

  const { effectiveness, lastUpdate, update: updateEffectiveness } = useCacheEffectiveness();

  const handleExport = () => {
    try {
      const exportedData = exportData();
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-analytics-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export analytics:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Eroare la încărcarea analizelor</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reîncearcă
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analize Cache AI</h2>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Actualizează
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Exportă Date
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{hitRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Rata de Hit Cache</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">${totalSavings.toFixed(4)}</div>
          <div className="text-sm text-gray-600">Economii Totale</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
          <div className="text-sm text-gray-600">Întrebări Totale</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{totalRecipes}</div>
          <div className="text-sm text-gray-600">Rețete cu Întrebări</div>
        </div>
      </div>

      {/* Cache Effectiveness Details */}
      {effectiveness && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Efectivitatea Cache-ului</h3>
            <div className="text-sm text-gray-500">
              Ultima actualizare: {lastUpdate?.toLocaleTimeString('ro-RO')}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-lg font-medium text-gray-900">{effectiveness.hits}</div>
              <div className="text-sm text-gray-600">Cache Hits</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">{effectiveness.misses}</div>
              <div className="text-sm text-gray-600">Cache Misses</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">{effectiveness.totalRequests}</div>
              <div className="text-sm text-gray-600">Total Cereri</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">
                ${effectiveness.costSaved.toFixed(4)}
              </div>
              <div className="text-sm text-gray-600">Cost Economisit</div>
            </div>
          </div>

          {/* Daily and Monthly Hit Rates */}
          {(effectiveness.dailyHitRate !== undefined ||
            effectiveness.monthlyHitRate !== undefined) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {effectiveness.dailyHitRate !== undefined && (
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {effectiveness.dailyHitRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Rata Hit Zilnică</div>
                  </div>
                )}

                {effectiveness.monthlyHitRate !== undefined && (
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {effectiveness.monthlyHitRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Rata Hit Lunară</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Questions */}
      {analytics?.topQuestions && analytics.topQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Întrebări</h3>

          <div className="space-y-3">
            {analytics.topQuestions.map((question, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{question.question}</div>
                  <div className="text-sm text-gray-600">
                    {question.count} întrebări · {question.recipes} rețete
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {question.lastAsked.toLocaleDateString('ro-RO')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Information */}
      {analytics?.stats && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informații Stocare</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-lg font-medium text-gray-900">
                {(analytics.stats.storageSize / 1024).toFixed(1)} KB
              </div>
              <div className="text-sm text-gray-600">Dimensiune Stocare</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">
                {analytics.stats.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Întrebări Urmărite</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">
                {analytics.stats.totalRecipes}
              </div>
              <div className="text-sm text-gray-600">Rețete Active</div>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900">
                {analytics.stats.oldestEntry
                  ? `${Math.floor((Date.now() - analytics.stats.oldestEntry.getTime()) / (1000 * 60 * 60 * 24))} zile`
                  : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Prima Înregistrare</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CacheAnalyticsDashboard;
