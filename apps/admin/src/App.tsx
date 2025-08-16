import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from '@coquinate/i18n';
import { AdminErrorBoundary } from './components/AdminErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminShell } from './components/layout/AdminShell';
import { LoginPage } from './pages/LoginPage';
import { TwoFactorPage } from './pages/TwoFactorPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecipesPage } from './pages/RecipesPage';
import { MealPlansPage } from './pages/MealPlansPage';
import { ValidationPage } from './pages/ValidationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

/**
 * Root Admin App component with routing and authentication
 */
export default function AdminApp() {
  return (
    <I18nProvider>
      <AdminErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/2fa" element={<TwoFactorPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <DashboardPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recipes"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <RecipesPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/meal-plans"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <MealPlansPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/validation"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <ValidationPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <AnalyticsPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminShell>
                    <SettingsPage />
                  </AdminShell>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminErrorBoundary>
    </I18nProvider>
  );
}
