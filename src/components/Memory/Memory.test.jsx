import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Memory from './Memory'

describe('Memory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the game with all cards', () => {
    render(<Memory onBack={() => {}} />)

    expect(screen.getByText('Memory')).toBeInTheDocument()
    expect(screen.getByText('Züge:')).toBeInTheDocument()
    expect(screen.getByText('Best:')).toBeInTheDocument()

    // Should have 16 cards (8 pairs)
    const cards = screen.getAllByText('?')
    expect(cards).toHaveLength(16)
  })

  it('shows back button and calls onBack when clicked', () => {
    const onBack = vi.fn()
    render(<Memory onBack={onBack} />)

    const backButton = screen.getByText('← Zurück')
    fireEvent.click(backButton)

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('flips a card when clicked', async () => {
    render(<Memory onBack={() => {}} />)

    // Find all card containers and click the first one
    const cardContainers = document.querySelectorAll('.card-container')
    fireEvent.click(cardContainers[0])

    // After click, the card should be flipped (transform changes)
    await waitFor(() => {
      const cardInner = cardContainers[0].querySelector('.card-inner')
      expect(cardInner.style.transform).toBe('rotateY(180deg)')
    })
  })

  it('increments move counter after flipping two cards', async () => {
    render(<Memory onBack={() => {}} />)

    const cardContainers = document.querySelectorAll('.card-container')

    // Click two cards
    fireEvent.click(cardContainers[0])
    fireEvent.click(cardContainers[1])

    // Moves should be 1 after flipping two cards
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('resets the game when reset button is clicked', async () => {
    render(<Memory onBack={() => {}} />)

    const cardContainers = document.querySelectorAll('.card-container')

    // Make some moves
    fireEvent.click(cardContainers[0])
    fireEvent.click(cardContainers[1])

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    // Click reset button
    const resetButton = screen.getByLabelText('Neues Spiel')
    fireEvent.click(resetButton)

    // Moves should be back to 0
    await waitFor(() => {
      const movesElements = screen.getAllByText('0')
      expect(movesElements.length).toBeGreaterThan(0)
    })
  })

  it('shows matches counter', () => {
    render(<Memory onBack={() => {}} />)

    // Text is split across elements, use a function matcher
    expect(screen.getByText(/Paare gefunden:/)).toBeInTheDocument()
    expect(screen.getByText(/\/ 8/)).toBeInTheDocument()
  })
})
