import React, { useState, useCallback } from 'react'
import Square from './Square'
import GameStatus from './GameStatus'

const WINNING_LINES = [
  [0, 1, 2], // Reihen
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Spalten
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonalen
  [2, 4, 6],
]

const INITIAL_BOARD = Array(9).fill(null)
const INITIAL_SCORES = { x: 0, o: 0, draws: 0 }

export default function TicTacToe() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [scores, setScores] = useState(INITIAL_SCORES)

  const checkWinner = useCallback((newBoard) => {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return { winner: newBoard[a], line }
      }
    }

    if (newBoard.every((square) => square !== null)) {
      return { winner: 'draw', line: [] }
    }

    return null
  }, [])

  const handleSquareClick = useCallback((index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)

      setScores((prev) => ({
        ...prev,
        ...(result.winner === 'X' && { x: prev.x + 1 }),
        ...(result.winner === 'O' && { o: prev.o + 1 }),
        ...(result.winner === 'draw' && { draws: prev.draws + 1 }),
      }))
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }, [board, currentPlayer, winner, checkWinner])

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD)
    setCurrentPlayer('X')
    setWinner(null)
    setWinningLine([])
  }, [])

  const resetScores = useCallback(() => {
    setScores(INITIAL_SCORES)
    resetGame()
  }, [resetGame])

  return (
    <div className="card tictactoe">
      <h2>Tic-Tac-Toe</h2>

      <div className="tictactoe-board" role="grid" aria-label="Tic-Tac-Toe Spielfeld">
        {board.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleSquareClick(index)}
            isWinning={winningLine.includes(index)}
            disabled={!!winner}
          />
        ))}
      </div>

      <GameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        scores={scores}
        onReset={resetGame}
        onResetScores={resetScores}
      />
    </div>
  )
}
