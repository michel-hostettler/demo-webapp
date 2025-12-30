import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SnakeGame from './SnakeGame'

describe('SnakeGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial state', () => {
    render(<SnakeGame />)
    expect(screen.getByRole('heading', { level: 2, name: 'QA Bug Hunter' })).toBeInTheDocument()
    expect(screen.getByText('Bugs Squashed:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows start overlay initially', () => {
    render(<SnakeGame />)
    expect(screen.getByText('Catch all the bugs!')).toBeInTheDocument()
    expect(screen.getByText('Start Hunting')).toBeInTheDocument()
  })

  it('starts game when Start Hunting is clicked', () => {
    render(<SnakeGame />)
    fireEvent.click(screen.getByText('Start Hunting'))
    expect(screen.queryByText('Start Hunting')).not.toBeInTheDocument()
  })

  it('pauses game when space is pressed', () => {
    render(<SnakeGame />)
    fireEvent.click(screen.getByText('Start Hunting'))
    fireEvent.keyDown(window, { key: ' ' })
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByText('Coffee break?')).toBeInTheDocument()
  })

  it('resumes game when Resume is clicked', () => {
    render(<SnakeGame />)
    fireEvent.click(screen.getByText('Start Hunting'))
    fireEvent.keyDown(window, { key: ' ' })
    fireEvent.click(screen.getByText('Resume'))
    expect(screen.queryByText('Paused')).not.toBeInTheDocument()
  })

  it('displays controls hint', () => {
    render(<SnakeGame />)
    expect(screen.getByText(/WASD/)).toBeInTheDocument()
    expect(screen.getByText(/Arrow Keys/)).toBeInTheDocument()
    expect(screen.getByText(/Space/)).toBeInTheDocument()
  })
})
