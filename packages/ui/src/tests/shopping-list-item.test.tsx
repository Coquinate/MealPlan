import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShoppingListItem } from '../components/shopping-list-item'

describe('ShoppingListItem Component', () => {
  const mockItem = {
    id: '1',
    name: 'Milk',
    quantity: '1L',
    category: 'Dairy',
    isChecked: false,
    onToggle: vi.fn()
  }

  it('renders without crashing', () => {
    render(<ShoppingListItem {...mockItem} />)
    expect(screen.getByText('Milk')).toBeInTheDocument()
  })

  it('displays item details', () => {
    render(<ShoppingListItem {...mockItem} />)
    
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('1L')).toBeInTheDocument()
    expect(screen.getByText('Dairy')).toBeInTheDocument()
  })

  it('shows checkbox state', () => {
    const { rerender } = render(<ShoppingListItem {...mockItem} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    rerender(<ShoppingListItem {...mockItem} isChecked={true} />)
    expect(checkbox).toBeChecked()
  })

  it('handles toggle clicks', () => {
    const onToggle = vi.fn()
    render(<ShoppingListItem {...mockItem} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('shows expiry warning with correct Romanian formatting', () => {
    const { rerender } = render(<ShoppingListItem {...mockItem} expiryDays={0} />)
    expect(screen.getByText('Azi')).toBeInTheDocument()
    
    rerender(<ShoppingListItem {...mockItem} expiryDays={1} />)
    expect(screen.getByText('Mâine')).toBeInTheDocument()
    
    rerender(<ShoppingListItem {...mockItem} expiryDays={2} />)
    expect(screen.getByText('2 zile')).toBeInTheDocument()
    
    rerender(<ShoppingListItem {...mockItem} expiryDays={5} />)
    expect(screen.getByText('5 zile')).toBeInTheDocument()
    
    rerender(<ShoppingListItem {...mockItem} expiryDays={10} />)
    expect(screen.getByText('10 zile')).toBeInTheDocument()
  })

  it('applies checked styling', () => {
    render(<ShoppingListItem {...mockItem} isChecked={true} />)
    const itemText = screen.getByText('Milk')
    expect(itemText).toHaveClass('line-through')
  })

  it('handles touch events for swipe gestures', () => {
    const onToggle = vi.fn()
    const { container } = render(<ShoppingListItem {...mockItem} onToggle={onToggle} />)
    
    const item = container.firstChild
    
    // Simulate swipe right to check
    fireEvent.touchStart(item!, { touches: [{ clientX: 0 }] })
    fireEvent.touchMove(item!, { touches: [{ clientX: 100 }] })
    fireEvent.touchEnd(item!)
    
    expect(onToggle).toHaveBeenCalledWith('1')
  })
})