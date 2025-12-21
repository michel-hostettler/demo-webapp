import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('increments count when + button clicked', () => {
    render(<Counter />)
    fireEvent.click(screen.getByTestId('increment'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('decrements count when - button clicked', () => {
    render(<Counter />)
    fireEvent.click(screen.getByTestId('decrement'))
    expect(screen.getByTestId('count')).toHaveTextContent('-1')
  })

  it('resets count to 0', () => {
    render(<Counter />)
    fireEvent.click(screen.getByTestId('increment'))
    fireEvent.click(screen.getByTestId('increment'))
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
