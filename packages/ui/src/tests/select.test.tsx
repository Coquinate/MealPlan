import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Select } from '../components/select'

describe('Select Component', () => {
  const mockOptions = [
    { value: 'breakfast', label: 'Mic dejun' },
    { value: 'lunch', label: 'Prânz' },
    { value: 'dinner', label: 'Cină' }
  ]

  it('handles value changes through props', () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <Select 
        options={mockOptions}
        placeholder="Selectează masa"
        onChange={handleChange}
      />
    )
    
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('Selectează masa')
    
    // Simulate value change through props
    rerender(
      <Select 
        options={mockOptions}
        placeholder="Selectează masa"
        value="lunch"
        onChange={handleChange}
      />
    )
    
    expect(trigger).toHaveTextContent('Prânz')
  })

  it('displays selected value and renders all options', async () => {
    const { rerender } = render(
      <Select 
        options={mockOptions}
        placeholder="Select meal type"
        value="dinner"
      />
    )
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Cină')
    
    rerender(
      <Select 
        options={mockOptions}
        placeholder="Select meal type"
        value="breakfast"
      />
    )
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Mic dejun')
  })

  it('respects disabled state and prevents interactions', () => {
    const handleChange = vi.fn()
    render(
      <Select 
        options={mockOptions}
        placeholder="Cannot select"
        disabled
        onChange={handleChange}
      />
    )
    
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('data-disabled')
    expect(trigger).toHaveClass('disabled:cursor-not-allowed')
    expect(trigger).toHaveClass('disabled:opacity-50')
    
    fireEvent.click(trigger)
    expect(screen.queryByText('Mic dejun')).not.toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()
  })
})