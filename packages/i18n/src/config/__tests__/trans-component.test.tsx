/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { 
  Trans, 
  CommonTrans, 
  AuthTrans,
  createNamespacedTrans,
  useNamespacedTrans,
  withTranslationHelpers
} from '../trans-component'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  Trans: ({ children, i18nKey, values, components }: any) => (
    <div data-testid="i18next-trans">
      {i18nKey} - {JSON.stringify(values)} - {children}
    </div>
  )
}))

describe('Trans Component', () => {
  it('should render with basic props', () => {
    render(
      <Trans i18nKey="test.key" />
    )

    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })

  it('should pass through all props to i18next Trans', () => {
    const values = { name: 'John' }
    
    render(
      <Trans 
        i18nKey="welcome.message" 
        ns="auth"
        values={values}
        shouldUnescape={false}
      />
    )

    const element = screen.getByTestId('i18next-trans')
    expect(element).toBeInTheDocument()
    expect(element.textContent).toContain('welcome.message')
    expect(element.textContent).toContain('{"name":"John"}')
  })

  it('should use common namespace by default', () => {
    render(<Trans i18nKey="button.save" />)
    
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })

  it('should render with components prop', () => {
    const components = [<strong key="0">Bold</strong>]
    
    render(
      <Trans 
        i18nKey="text.withBold" 
        components={components}
      />
    )

    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })
})

describe('Pre-configured Trans Components', () => {
  it('should render CommonTrans', () => {
    render(<CommonTrans i18nKey="button.save" />)
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })

  it('should render AuthTrans', () => {
    render(<AuthTrans i18nKey="login.title" />)
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })
})

describe('createNamespacedTrans', () => {
  it('should create namespace-specific component', () => {
    const MealsTrans = createNamespacedTrans('meals')
    
    render(<MealsTrans i18nKey="weekly.view" />)
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })

  it('should not require ns prop on created component', () => {
    const CustomTrans = createNamespacedTrans('recipes')
    
    // This should not have TypeScript errors
    render(<CustomTrans i18nKey="ingredient.amount" />)
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })
})

describe('useNamespacedTrans hook', () => {
  function TestComponent() {
    const TransComponent = useNamespacedTrans('settings')
    return TransComponent({ i18nKey: 'profile.edit' })
  }

  it('should return functional Trans component', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })
})

describe('withTranslationHelpers HOC', () => {
  interface TestProps {
    title: string
    trans: typeof Trans
  }

  function TestComponent({ title, trans }: TestProps) {
    return (
      <div>
        <h1>{title}</h1>
        {trans({ i18nKey: 'button.save' })}
      </div>
    )
  }

  it('should inject trans prop', () => {
    const WrappedComponent = withTranslationHelpers(TestComponent)
    
    render(<WrappedComponent title="Test Page" />)
    
    expect(screen.getByText('Test Page')).toBeInTheDocument()
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })

  it('should use custom namespace', () => {
    const WrappedComponent = withTranslationHelpers(TestComponent, 'auth')
    
    render(<WrappedComponent title="Auth Page" />)
    
    expect(screen.getByText('Auth Page')).toBeInTheDocument()
    expect(screen.getByTestId('i18next-trans')).toBeInTheDocument()
  })
})