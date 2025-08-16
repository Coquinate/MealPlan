import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  require2FA?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = true,
  require2FA = true,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAdmin, needs2FA, error } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary mx-auto"></div>
          <p className="mt-4 text-admin-text-secondary">Se verifică autentificarea...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (require2FA && needs2FA) {
    return <Navigate to="/admin/2fa" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-surface">
        <div className="bg-white p-8 rounded-card shadow-card max-w-md w-full">
          <div className="text-center">
            <div className="text-status-error text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-admin-text mb-2">Eroare de Acces</h2>
            <p className="text-admin-text-secondary">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
