'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { useAuth } from '@coquinate/shared'
import { useTranslation } from '@coquinate/i18n'

/**
 * Login page component
 * Handles user authentication with email/password
 */
export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation('auth')
  const { signIn, isAuthenticated, isInitialized, error, clearError } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      // Check for redirect URL in query params
      const redirect = router.query.redirect as string
      router.push(redirect || '/dashboard')
    }
  }, [isAuthenticated, isInitialized, router])
  
  // Handle login submission
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true)
      clearError()
      await signIn(credentials)
      
      // Redirect will happen via useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login failed:', error)
      // Error is already set in the store by signIn
    } finally {
      setLoading(false)
    }
  }
  
  // Handle navigation
  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }
  
  const handleCreateAccount = () => {
    router.push('/auth/register')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Coquinate</h1>
          <p className="text-sm text-text-secondary">
            Planificarea meselor făcută simplu
          </p>
        </div>
        
        {/* Login Form */}
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
          loading={loading}
          error={error || undefined}
        />
        
        {/* Footer */}
        <div className="text-center text-xs text-text-secondary">
          <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
        </div>
      </div>
    </div>
  )
}