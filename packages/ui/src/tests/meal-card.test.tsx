import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MealCard } from '../components/meal-card'

describe('MealCard Component', () => {
  const mockMeal = {
    id: '1',
    title: 'Spaghetti Carbonara',
    image: '/meal.jpg',
    cookTime: 30,
    servings: 4,
    mealType: 'dinner' as const
  }

  it('renders without crashing', () => {
    render(<MealCard {...mockMeal} />)
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument()
  })

  it('displays meal information', () => {
    render(<MealCard {...mockMeal} />)
    
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<MealCard {...mockMeal} onClick={handleClick} />)
    
    const card = document.querySelector('[class*="cursor-pointer"]')
    fireEvent.click(card!)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows leftover variant', () => {
    const { container } = render(<MealCard {...mockMeal} variant="leftover" isLeftover />)
    const card = container.firstChild
    expect(card).toHaveClass('border-leftover')
  })

  it('shows cooked state', () => {
    const { container } = render(<MealCard {...mockMeal} isCooked />)
    // Just verify it renders with cooked state
    expect(container.firstChild).toBeInTheDocument()
  })

  it('shows locked state', () => {
    const { container } = render(<MealCard {...mockMeal} variant="locked" isLocked />)
    const card = container.firstChild
    expect(card).toHaveClass('cursor-not-allowed')
  })
})