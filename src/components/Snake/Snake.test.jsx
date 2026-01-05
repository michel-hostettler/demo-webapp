import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Snake from './Snake'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Snake', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders the game title', () => {
    render(<Snake />)
    expect(screen.getByText('Snake')).toBeInTheDocument()
  })

  it('shows initial score of 0', () => {
    render(<Snake />)
    const scoreElements = screen.getAllByText('0')
    expect(scoreElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the start button initially', () => {
    render(<Snake />)
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('shows pause button when game is started', async () => {
    render(<Snake />)
    const startButton = screen.getByRole('button', { name: /start/i })

    await act(async () => {
      fireEvent.click(startButton)
    })

    expect(screen.getByRole('button', { name: /pausieren/i })).toBeInTheDocument()
  })

  it('renders directional control buttons', () => {
    render(<Snake />)
    expect(screen.getByRole('button', { name: /nach oben/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nach unten/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nach links/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nach rechts/i })).toBeInTheDocument()
  })

  it('shows control instructions', () => {
    render(<Snake />)
    expect(screen.getByText(/pfeiltasten oder wasd/i)).toBeInTheDocument()
  })

  it('renders the game board', () => {
    render(<Snake />)
    expect(screen.getByRole('img', { name: /spielfeld/i })).toBeInTheDocument()
  })

  it('loads highscore from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('50')
    render(<Snake />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('shows Punkte and Highscore labels', () => {
    render(<Snake />)
    expect(screen.getByText('Punkte')).toBeInTheDocument()
    expect(screen.getByText('Highscore')).toBeInTheDocument()
  })
})
