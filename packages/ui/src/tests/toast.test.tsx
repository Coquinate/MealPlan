import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from '../components/toast'

describe('Toast Component', () => {
  it('renders toast content', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Operation completed successfully</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument()
  })

  it('renders different toast variants', () => {
    const { rerender } = render(
      <ToastProvider>
        <Toast variant="success">
          <ToastTitle>Success Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    
    expect(screen.getByText('Success Toast')).toBeInTheDocument()
    
    rerender(
      <ToastProvider>
        <Toast variant="error">
          <ToastTitle>Error Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    
    expect(screen.getByText('Error Toast')).toBeInTheDocument()
  })

  it('renders with action button', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <button>Undo</button>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    
    expect(screen.getByText('Undo')).toBeInTheDocument()
  })
})