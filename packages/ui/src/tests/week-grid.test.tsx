import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeekGrid } from '../components/week-grid'

describe('WeekGrid Component', () => {
  const mockMeals = [
    {
      id: '1',
      date: '2025-08-11',
      breakfast: { id: 'b1', title: 'Oatmeal', cookTime: 10, servings: 1 },
      lunch: { id: 'l1', title: 'Salad', cookTime: 15, servings: 2 },
      dinner: { id: 'd1', title: 'Pasta', cookTime: 30, servings: 4 },
    },
    {
      id: '2',
      date: '2025-08-12',
      breakfast: { id: 'b2', title: 'Toast', cookTime: 5, servings: 1 },
      lunch: null,
      dinner: { id: 'd2', title: 'Soup', cookTime: 45, servings: 3 },
    }
  ]

  it('renders 7-column grid layout on desktop', () => {
    const { container } = render(<WeekGrid meals={mockMeals} />)
    // Check for 7-column grid on desktop
    const gridContainer = container.querySelector('.md\\:grid-cols-7')
    expect(gridContainer).toBeInTheDocument()
  })

  it('displays Romanian day headers correctly', () => {
    render(<WeekGrid meals={mockMeals} />)
    
    // Check all day headers are present (both desktop and mobile render them)
    const luniHeaders = screen.getAllByText('Luni')
    const martiHeaders = screen.getAllByText('Marți')
    
    expect(luniHeaders.length).toBeGreaterThan(0)
    expect(martiHeaders.length).toBeGreaterThan(0)
  })

  it('renders meal cards in both desktop and mobile views', () => {
    render(<WeekGrid meals={mockMeals} />)
    
    // Use getAllByText since both desktop and mobile views render
    const oatmealCards = screen.getAllByText('Oatmeal')
    const saladCards = screen.getAllByText('Salad')
    const pastaCards = screen.getAllByText('Pasta')
    const toastCards = screen.getAllByText('Toast')
    const soupCards = screen.getAllByText('Soup')
    
    // Each meal appears twice (desktop and mobile)
    expect(oatmealCards).toHaveLength(2)
    expect(saladCards).toHaveLength(2)
    expect(pastaCards).toHaveLength(2)
    expect(toastCards).toHaveLength(2)
    expect(soupCards).toHaveLength(2)
  })

  it('highlights today column with proper Romanian day labels', () => {
    const today = new Date()
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
    const daysOfWeek = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']
    
    const mockWeekMeals = Array.from({ length: 7 }, (_, idx) => ({
      breakfast: idx === todayIndex ? { id: `b${idx}`, title: 'Oatmeal', cookTime: 10, servings: 1 } : null,
      lunch: null,
      dinner: null
    }))
    
    const { container } = render(<WeekGrid meals={mockWeekMeals} />)
    
    // Check for today's highlighting with ring-primary class
    const todayColumn = container.querySelector('.ring-primary')
    expect(todayColumn).toBeInTheDocument()
    
    // Check for "Azi" indicator (appears in both desktop and mobile)
    const aziIndicators = screen.getAllByText('Azi')
    expect(aziIndicators.length).toBeGreaterThan(0)
    expect(aziIndicators[0]).toHaveClass('text-primary')
    
    // Check that the correct day is highlighted (appears multiple times)
    const todayLabels = screen.getAllByText(daysOfWeek[todayIndex])
    expect(todayLabels.length).toBeGreaterThan(0)
    expect(todayLabels[0]).toHaveClass('text-primary')
  })

  it('shows proper skeleton loading state', () => {
    const { container } = render(<WeekGrid meals={[]} isLoading={true} />)
    
    // Check for animate-pulse on container
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    
    // Check for day header skeletons (7 days)
    const headerSkeletons = container.querySelectorAll('.h-6.bg-gray-200')
    expect(headerSkeletons).toHaveLength(7)
    
    // Check for meal card skeletons (7 days * 4 meal types = 28)
    const mealSkeletons = container.querySelectorAll('.h-32.bg-gray-100')
    expect(mealSkeletons).toHaveLength(28)
  })
})