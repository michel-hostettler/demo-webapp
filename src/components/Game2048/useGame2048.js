import { useState, useCallback, useEffect } from 'react'

const GRID_SIZE = 4

const createEmptyGrid = () =>
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))

const getRandomEmptyCell = (grid) => {
  const emptyCells = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col })
      }
    }
  }
  return emptyCells.length > 0
    ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
    : null
}

const addRandomTile = (grid) => {
  const newGrid = grid.map(row => [...row])
  const cell = getRandomEmptyCell(newGrid)
  if (cell) {
    newGrid[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4
  }
  return newGrid
}

const slideRow = (row) => {
  const filtered = row.filter(val => val !== 0)
  const merged = []
  let score = 0

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2)
      score += filtered[i] * 2
      i++
    } else {
      merged.push(filtered[i])
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(0)
  }

  return { row: merged, score }
}

const rotateGrid = (grid, times = 1) => {
  let result = grid
  for (let t = 0; t < times; t++) {
    result = result[0].map((_, colIndex) =>
      result.map(row => row[colIndex]).reverse()
    )
  }
  return result
}

const moveLeft = (grid) => {
  let totalScore = 0
  const newGrid = grid.map(row => {
    const { row: newRow, score } = slideRow(row)
    totalScore += score
    return newRow
  })
  return { grid: newGrid, score: totalScore }
}

const move = (grid, direction) => {
  let rotations = { left: 0, up: 1, right: 2, down: 3 }
  let rotated = rotateGrid(grid, rotations[direction])
  let { grid: moved, score } = moveLeft(rotated)
  let result = rotateGrid(moved, (4 - rotations[direction]) % 4)
  return { grid: result, score }
}

const gridsEqual = (a, b) =>
  JSON.stringify(a) === JSON.stringify(b)

const canMove = (grid) => {
  for (let dir of ['left', 'right', 'up', 'down']) {
    const { grid: newGrid } = move(grid, dir)
    if (!gridsEqual(grid, newGrid)) return true
  }
  return false
}

const hasWon = (grid) =>
  grid.some(row => row.some(cell => cell >= 2048))

export function useGame2048() {
  const [grid, setGrid] = useState(() => {
    let g = createEmptyGrid()
    g = addRandomTile(g)
    g = addRandomTile(g)
    return g
  })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('game2048HighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasWonGame, setHasWonGame] = useState(false)

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('game2048HighScore', score.toString())
    }
  }, [score, highScore])

  const handleMove = useCallback((direction) => {
    if (isGameOver) return

    setGrid(currentGrid => {
      const { grid: newGrid, score: moveScore } = move(currentGrid, direction)

      if (gridsEqual(currentGrid, newGrid)) {
        return currentGrid
      }

      const gridWithNewTile = addRandomTile(newGrid)

      setScore(s => s + moveScore)

      if (hasWon(gridWithNewTile) && !hasWonGame) {
        setHasWonGame(true)
      }

      if (!canMove(gridWithNewTile)) {
        setIsGameOver(true)
      }

      return gridWithNewTile
    })
  }, [isGameOver, hasWonGame])

  const resetGame = useCallback(() => {
    let g = createEmptyGrid()
    g = addRandomTile(g)
    g = addRandomTile(g)
    setGrid(g)
    setScore(0)
    setIsGameOver(false)
    setHasWonGame(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      }
      if (keyMap[e.key]) {
        e.preventDefault()
        handleMove(keyMap[e.key])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleMove])

  return {
    grid,
    score,
    highScore,
    isGameOver,
    hasWonGame,
    handleMove,
    resetGame,
  }
}
