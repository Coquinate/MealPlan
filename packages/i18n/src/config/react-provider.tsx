import React, { Suspense, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { initializeI18n } from './i18n'

interface I18nProviderProps {
  children: ReactNode
}

/**
 * React provider component for i18n functionality
 * Initializes i18next and provides context to child components
 * 
 * @param children - React child components
 * @returns JSX.Element - Provider wrapper with loading state
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = React.useState(false)
  
  React.useEffect(() => {
    const initialize = async () => {
      try {
        await initializeI18n()
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        // Continue with default i18n instance for resilience
        setIsInitialized(true)
      }
    }
    
    initialize()
  }, [])
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">{/* Loading text will use i18n */}</p>
        </div>
      </div>
    )
  }
  
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-muted-foreground">{/* Loading text will use i18n */}</div>
          </div>
        }
      >
        {children}
      </Suspense>
    </I18nextProvider>
  )
}

/**
 * Higher-order component for page-level translations
 * Ensures translations are loaded before rendering component
 * 
 * @param Component - React component to wrap
 * @param namespaces - Translation namespaces required by the component
 * @returns React component with translation loading
 */
export function withTranslations<T extends object>(
  Component: React.ComponentType<T>,
  namespaces: string[] = ['common']
) {
  return function WrappedComponent(props: T) {
    const [isLoading, setIsLoading] = React.useState(true)
    
    React.useEffect(() => {
      const loadNamespaces = async () => {
        try {
          await Promise.all(
            namespaces.map(ns => i18n.loadNamespaces(ns))
          )
        } catch (error) {
          console.error('Failed to load translation namespaces:', error)
        } finally {
          setIsLoading(false)
        }
      }
      
      loadNamespaces()
    }, [])
    
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-full mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}