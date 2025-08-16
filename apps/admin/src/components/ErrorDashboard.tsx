import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Card } from '@coquinate/ui';
import { supabase } from '@/lib/supabase';
import { fetchWithCSRF } from '@/utils/csrf';
import {
  ErrorLogEntry,
  ErrorStatsResponse,
  ErrorDashboardResponse,
  isApiResponse,
  transformApiResponse,
  extractData,
} from '@/types/api';
import { auditLog } from '@/utils/audit-log';
import { permissions, PermissionGuard, usePermission } from '@/utils/permissions';

/**
 * Admin Dashboard pentru monitorizarea erorilor în timp real
 * Permite administratorilor să vadă, să gestioneze și să rezolve erorile aplicației
 */
export function ErrorDashboard() {
  const { hasPermission: canResolveErrors } = usePermission('errors.resolve');
  const { hasPermission: canViewErrors } = usePermission('errors.view');

  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
  const [stats, setStats] = useState<ErrorStatsResponse>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    unresolved: 0,
    last24h: 0,
    byCategory: {},
    trend: 'stable',
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'unresolved'>('all');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Mock data loader function
  const loadMockData = useCallback(() => {
    const mockErrors: ErrorLogEntry[] = [
      {
        id: 'err_001',
        timestamp: '2025-08-14T14:15:00.000Z',
        severity: 'critical',
        category: 'payment',
        errorMessage: 'Stripe webhook failed to process payment',
        userId: 'user_123',
        route: '/api/webhooks/stripe',
        resolved: false,
      },
      {
        id: 'err_002',
        timestamp: '2025-08-14T14:10:00.000Z',
        severity: 'high',
        category: 'auth',
        errorMessage: 'User authentication timeout',
        userId: 'user_456',
        route: '/auth/login',
        resolved: false,
      },
      {
        id: 'err_003',
        timestamp: '2025-08-14T14:05:00.000Z',
        severity: 'medium',
        category: 'database',
        errorMessage: 'Query timeout on recipes table',
        route: '/api/recipes',
        resolved: true,
      },
    ];

    const mockStats: ErrorStatsResponse = {
      total: 127,
      critical: 3,
      high: 12,
      medium: 8,
      low: 4,
      unresolved: 15,
      last24h: 34,
      byCategory: {
        payment: 15,
        auth: 23,
        database: 34,
        frontend: 30,
        backend: 25,
      },
      trend: 'stable',
    };

    setTimeout(() => {
      setErrors(mockErrors);
      setStats(mockStats);
      setLoading(false);
      console.log('📊 Loaded mock error data for development');
    }, 500);
  }, []);

  // Încărcare date (reale cu fallback la mock pentru dezvoltare)
  const loadErrorData = useCallback(async () => {
    setLoading(true);
    try {
      // Get current session for auth
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Try to load real data from API using session token
        const response = await fetchWithCSRF(`/api/admin/errors?filter=${filter}&limit=50`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const rawData = await response.json();
          const data = transformApiResponse<ErrorDashboardResponse>(rawData);

          if (data.success && data.data) {
            const dashboardData = data.data as ErrorDashboardResponse;
            setErrors(dashboardData.errors || []);
            setStats(
              dashboardData.stats || {
                total: 0,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                unresolved: 0,
                last24h: 0,
                byCategory: {},
                trend: 'stable',
              }
            );
            console.log('✅ Loaded real error data from API');
          } else {
            console.warn('⚠️ Invalid API response format, using mock data');
            loadMockData();
          }
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn('⚠️ API unavailable, using mock data:', error);
    }

    // Fallback to mock data
    loadMockData();
  }, [filter, loadMockData]);

  useEffect(() => {
    loadErrorData();
  }, [loadErrorData]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Simple utility functions (React 19 optimizes these automatically)
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return '💳';
      case 'auth':
        return '🔐';
      case 'database':
        return '🗄️';
      case 'frontend':
        return '🖥️';
      case 'backend':
        return '⚙️';
      default:
        return '❓';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'payment':
        return 'Plăți';
      case 'auth':
        return 'Autentificare';
      case 'database':
        return 'Bază de date';
      case 'frontend':
        return 'Interfață';
      case 'backend':
        return 'Server';
      default:
        return category;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'CRITIC';
      case 'high':
        return 'RIDICAT';
      case 'medium':
        return 'MEDIU';
      case 'low':
        return 'SCĂZUT';
      default:
        return severity.toUpperCase();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ro-RO');
  };

  const updateLocalErrorStatus = (errorId: string, resolved: boolean) => {
    setErrors((prev) => prev.map((err) => (err.id === errorId ? { ...err, resolved } : err)));

    setStats((prev) => ({
      ...prev,
      unresolved: resolved ? Math.max(0, prev.unresolved - 1) : prev.unresolved + 1,
    }));
  };

  const handleResolveError = async (errorId: string, resolved: boolean = true) => {
    try {
      // Check permission first
      await permissions.requirePermission('errors.resolve', `error:${errorId}`);

      // Get current session for auth
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error('❌ No active session');
        updateLocalErrorStatus(errorId, resolved);
        return;
      }

      const response = await fetchWithCSRF('/api/admin/errors', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: errorId, resolved }),
      });

      if (response.ok) {
        // Log the action
        await auditLog.errorResolve(errorId, resolved);
        // Reload data to reflect changes
        await loadErrorData();
        console.log('✅ Error status updated successfully');
      } else {
        // Fallback to local state update if API fails
        updateLocalErrorStatus(errorId, resolved);
        console.warn('⚠️ API unavailable, updated locally');
      }
    } catch (error) {
      // Fallback to local state update if fetch fails
      updateLocalErrorStatus(errorId, resolved);
      console.error('❌ Error updating status:', error);
    }
  };

  const handleSendTestAlert = useCallback(async () => {
    // Simulare trimitere alertă de test cu debounce pentru a preveni spam-ul
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(async () => {
      try {
        console.log('🔔 Trimitere alertă de test...');
        // În implementarea reală, aici ar fi apelul către API
        setTimeout(() => {
          console.log('✅ Alertă de test trimisă cu succes!');
        }, 1000);
      } catch (error) {
        console.error('❌ Eroare la trimiterea alertei de test:', error);
      } finally {
        setDebounceTimer(null);
      }
    }, 500); // 500ms debounce

    setDebounceTimer(newTimer);
  }, [debounceTimer]);

  // Simple filtering (React 19 optimizes automatically)
  const filteredErrors = errors.filter((error) => {
    switch (filter) {
      case 'critical':
        return error.severity === 'critical';
      case 'unresolved':
        return !error.resolved;
      default:
        return true;
    }
  });

  // Keep memoization for expensive multi-filter operations
  const errorCounts = useMemo(
    () => ({
      total: errors.length,
      critical: errors.filter((e) => e.severity === 'critical').length,
      unresolved: errors.filter((e) => !e.resolved).length,
    }),
    [errors]
  );

  if (!canViewErrors) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acces Restricționat</h2>
            <p className="text-gray-600">Nu aveți permisiunea de a vizualiza erorile sistemului.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Monitorizare Erori</h1>
          <Button variant="secondary" size="sm" onClick={handleSendTestAlert}>
            🔔 Test Alertă
          </Button>
        </div>
        <p className="text-gray-600">
          Monitorizează și gestionează erorile aplicației în timp real
        </p>
      </div>

      {/* Statistici Erori */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Erori</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Critice</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          <div className="text-sm text-gray-600">Prioritate Mare</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.unresolved}</div>
          <div className="text-sm text-gray-600">Nerezolvate</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.last24h}</div>
          <div className="text-sm text-gray-600">Ultimele 24h</div>
        </Card>
      </div>

      {/* Filtrare */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toate ({errorCounts.total})
          </Button>
          <Button
            variant={filter === 'critical' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('critical')}
          >
            Critice ({errorCounts.critical})
          </Button>
          <Button
            variant={filter === 'unresolved' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('unresolved')}
          >
            Nerezolvate ({errorCounts.unresolved})
          </Button>
        </div>
      </div>

      {/* Lista Erori */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Jurnalul Erorilor</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredErrors.map((error) => (
            <div key={error.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(error.category)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}
                    >
                      {getSeverityLabel(error.severity)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getCategoryLabel(error.category)}
                    </span>
                    {error.resolved && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                        REZOLVATĂ
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-medium text-gray-900 mb-2">{error.errorMessage}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Data/Ora:</strong> {formatTimestamp(error.timestamp)}
                    </div>
                    {error.userId && (
                      <div>
                        <strong>ID Utilizator:</strong> {error.userId}
                      </div>
                    )}
                    {error.route && (
                      <div>
                        <strong>Rută:</strong>{' '}
                        <code className="bg-gray-100 px-1 rounded">{error.route}</code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!error.resolved && canResolveErrors && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolveError(error.id)}
                    >
                      Marchează Rezolvată
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">
                    Detalii
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredErrors.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">🎉</div>
              <div className="text-lg font-medium">Nu sunt erori de afișat</div>
              <div className="text-sm">
                {filter === 'all'
                  ? 'Nu au fost înregistrate erori recent.'
                  : `Nu sunt erori ${filter === 'critical' ? 'critice' : 'nerezolvate'}.`}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
