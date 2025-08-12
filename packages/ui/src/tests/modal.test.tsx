import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '../components/modal'

describe('Modal Component', () => {
  it('renders when open', () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal description text</ModalDescription>
          </ModalHeader>
          <div>Modal body content</div>
          <ModalFooter>
            <button>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal description text')).toBeInTheDocument()
    expect(screen.getByText('Modal body content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal open={false}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Hidden Modal</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    
    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument()
  })

  it('renders with different size variants', () => {
    const { rerender } = render(
      <Modal open>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Small Modal</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    
    expect(screen.getByText('Small Modal')).toBeInTheDocument()
    
    rerender(
      <Modal open>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Large Modal</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    
    expect(screen.getByText('Large Modal')).toBeInTheDocument()
  })
})