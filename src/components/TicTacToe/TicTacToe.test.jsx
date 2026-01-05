import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TicTacToe from './TicTacToe'

describe('TicTacToe', () => {
  it('renders 9 squares', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })
    expect(squares).toHaveLength(9)
  })

  it('shows X after first click', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })
    fireEvent.click(squares[0])
    expect(squares[0]).toHaveTextContent('X')
  })

  it('alternates between X and O', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    fireEvent.click(squares[0])
    expect(squares[0]).toHaveTextContent('X')

    fireEvent.click(squares[1])
    expect(squares[1]).toHaveTextContent('O')

    fireEvent.click(squares[2])
    expect(squares[2]).toHaveTextContent('X')
  })

  it('prevents clicking on occupied square', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    fireEvent.click(squares[0])
    expect(squares[0]).toHaveTextContent('X')

    fireEvent.click(squares[0])
    expect(squares[0]).toHaveTextContent('X')
  })

  it('detects horizontal win', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    // X: 0, 1, 2 (top row)
    // O: 3, 4
    fireEvent.click(squares[0]) // X
    fireEvent.click(squares[3]) // O
    fireEvent.click(squares[1]) // X
    fireEvent.click(squares[4]) // O
    fireEvent.click(squares[2]) // X wins

    expect(screen.getByText(/Spieler X gewinnt/i)).toBeInTheDocument()
  })

  it('detects vertical win', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    // X: 0, 3, 6 (left column)
    // O: 1, 2
    fireEvent.click(squares[0]) // X
    fireEvent.click(squares[1]) // O
    fireEvent.click(squares[3]) // X
    fireEvent.click(squares[2]) // O
    fireEvent.click(squares[6]) // X wins

    expect(screen.getByText(/Spieler X gewinnt/i)).toBeInTheDocument()
  })

  it('detects diagonal win', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    // X: 0, 4, 8 (diagonal)
    // O: 1, 2
    fireEvent.click(squares[0]) // X
    fireEvent.click(squares[1]) // O
    fireEvent.click(squares[4]) // X
    fireEvent.click(squares[2]) // O
    fireEvent.click(squares[8]) // X wins

    expect(screen.getByText(/Spieler X gewinnt/i)).toBeInTheDocument()
  })

  it('detects draw', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    // Draw scenario:
    // X O X
    // X X O
    // O X O
    fireEvent.click(squares[0]) // X
    fireEvent.click(squares[1]) // O
    fireEvent.click(squares[2]) // X
    fireEvent.click(squares[5]) // O
    fireEvent.click(squares[3]) // X
    fireEvent.click(squares[6]) // O
    fireEvent.click(squares[4]) // X
    fireEvent.click(squares[8]) // O
    fireEvent.click(squares[7]) // X - Draw

    expect(screen.getByText(/Unentschieden/i)).toBeInTheDocument()
  })

  it('resets game when clicking new game button', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    fireEvent.click(squares[0])
    fireEvent.click(squares[1])

    fireEvent.click(screen.getByRole('button', { name: /Neues Spiel/i }))

    const newSquares = screen.getAllByRole('button', { name: /feld/i })
    newSquares.forEach(square => {
      expect(square).toHaveTextContent('')
    })
  })

  it('updates scoreboard after win', () => {
    render(<TicTacToe />)
    const squares = screen.getAllByRole('button', { name: /feld/i })

    // X wins
    fireEvent.click(squares[0]) // X
    fireEvent.click(squares[3]) // O
    fireEvent.click(squares[1]) // X
    fireEvent.click(squares[4]) // O
    fireEvent.click(squares[2]) // X wins

    // Check score display - X should have 1 point
    const scoreboard = document.querySelector('.tictactoe-scoreboard')
    const xScore = scoreboard.querySelector('.score.x')
    expect(xScore).toHaveTextContent('1')
  })
})
