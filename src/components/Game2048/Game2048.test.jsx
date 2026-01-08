import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Game2048 from './Game2048'

describe('Game2048', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the game title', () => {
    render(<Game2048 />)
    expect(screen.getByText('2048')).toBeInTheDocument()
  })

  it('renders the game grid', () => {
    render(<Game2048 />)
    expect(screen.getByTestId('game-grid')).toBeInTheDocument()
  })

  it('displays score labels', () => {
    render(<Game2048 />)
    expect(screen.getByText('SCORE')).toBeInTheDocument()
    expect(screen.getByText('BEST')).toBeInTheDocument()
  })

  it('renders direction control buttons', () => {
    render(<Game2048 />)
    expect(screen.getByTestId('btn-up')).toBeInTheDocument()
    expect(screen.getByTestId('btn-down')).toBeInTheDocument()
    expect(screen.getByTestId('btn-left')).toBeInTheDocument()
    expect(screen.getByTestId('btn-right')).toBeInTheDocument()
  })

  it('renders reset button', () => {
    render(<Game2048 />)
    expect(screen.getByTestId('btn-reset')).toBeInTheDocument()
    expect(screen.getByText('Neues Spiel')).toBeInTheDocument()
  })

  it('starts with at least one tile', () => {
    render(<Game2048 />)
    const tiles = screen.getAllByTestId(/^tile-/)
    const nonZeroTiles = tiles.filter(tile =>
      tile.getAttribute('data-testid') !== 'tile-0'
    )
    expect(nonZeroTiles.length).toBeGreaterThanOrEqual(1)
  })

  it('responds to reset button click', () => {
    render(<Game2048 />)
    const resetBtn = screen.getByTestId('btn-reset')
    fireEvent.click(resetBtn)
    expect(screen.getByTestId('game-grid')).toBeInTheDocument()
  })

  it('responds to direction button clicks', () => {
    render(<Game2048 />)
    const upBtn = screen.getByTestId('btn-up')
    const downBtn = screen.getByTestId('btn-down')
    const leftBtn = screen.getByTestId('btn-left')
    const rightBtn = screen.getByTestId('btn-right')

    fireEvent.click(upBtn)
    fireEvent.click(downBtn)
    fireEvent.click(leftBtn)
    fireEvent.click(rightBtn)

    expect(screen.getByTestId('game-grid')).toBeInTheDocument()
  })
})
