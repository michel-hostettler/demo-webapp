import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameSelector from './GameSelector'

describe('GameSelector', () => {
  it('renders all game buttons', () => {
    render(<GameSelector selectedGame="snake" onSelectGame={() => {}} />)

    expect(screen.getByTestId('game-btn-snake')).toBeInTheDocument()
    expect(screen.getByTestId('game-btn-2048')).toBeInTheDocument()
  })

  it('displays game names', () => {
    render(<GameSelector selectedGame="snake" onSelectGame={() => {}} />)

    expect(screen.getByText('Snake')).toBeInTheDocument()
    expect(screen.getByText('2048')).toBeInTheDocument()
  })

  it('displays game descriptions', () => {
    render(<GameSelector selectedGame="snake" onSelectGame={() => {}} />)

    // Descriptions exist in DOM (even if visually hidden on mobile)
    expect(screen.getByText('Klassisches Snake-Spiel')).toBeInTheDocument()
    expect(screen.getByText('Zahlen-Puzzle Klassiker')).toBeInTheDocument()
  })

  it('calls onSelectGame when clicking a game button', () => {
    const mockSelect = vi.fn()
    render(<GameSelector selectedGame="snake" onSelectGame={mockSelect} />)

    fireEvent.click(screen.getByTestId('game-btn-2048'))
    expect(mockSelect).toHaveBeenCalledWith('2048')
  })

  it('highlights the selected game', () => {
    const { rerender } = render(
      <GameSelector selectedGame="snake" onSelectGame={() => {}} />
    )

    const snakeBtn = screen.getByTestId('game-btn-snake')
    // Check for Tailwind class instead of inline style
    expect(snakeBtn.className).toContain('border-green-500')

    rerender(<GameSelector selectedGame="2048" onSelectGame={() => {}} />)

    const game2048Btn = screen.getByTestId('game-btn-2048')
    expect(game2048Btn.className).toContain('border-amber-500')
  })
})
