import { useState, useCallback, useEffect, useRef } from 'react'

const GRID_SIZE = 4

let tileIdCounter = 0
const getNextTileId = () => ++tileIdCounter

// Create tile object with unique ID
const createTile = (value, row, col) => ({
  id: getNextTileId(),
  value,
  row,
  col,
  previousRow: null,
  previousCol: null,
  isNew: true,
  isMerged: false,
})

const createEmptyGrid = () =>
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))

const getRandomEmptyCell = (grid) => {
  const emptyCells = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
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
    const value = Math.random() < 0.9 ? 2 : 4
    newGrid[cell.row][cell.col] = createTile(value, cell.row, cell.col)
  }
  return newGrid
}

// Slide row to the left and track tile movements
const slideRowWithTracking = (row, rowIndex) => {
  const tiles = row.filter(tile => tile !== null)
  const result = []
  let score = 0

  for (let i = 0; i < tiles.length; i++) {
    if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
      // Merge tiles
      const mergedValue = tiles[i].value * 2
      const mergedTile = {
        id: getNextTileId(),
        value: mergedValue,
        row: rowIndex,
        col: result.length,
        previousRow: tiles[i].row,
        previousCol: tiles[i].col,
        isNew: false,
        isMerged: true,
        mergedFrom: [tiles[i].id, tiles[i + 1].id],
      }
      result.push(mergedTile)
      score += mergedValue
      i++ // Skip next tile (it was merged)
    } else {
      // Move tile
      const movedTile = {
        ...tiles[i],
        previousRow: tiles[i].row,
        previousCol: tiles[i].col,
        row: rowIndex,
        col: result.length,
        isNew: false,
        isMerged: false,
      }
      result.push(movedTile)
    }
  }

  // Fill remaining with null
  while (result.length < GRID_SIZE) {
    result.push(null)
  }

  return { row: result, score }
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

// Update tile positions after rotation
const updateTilePositions = (grid) => {
  return grid.map((row, rowIndex) =>
    row.map((tile, colIndex) => {
      if (tile === null) return null
      return { ...tile, row: rowIndex, col: colIndex }
    })
  )
}

const moveLeft = (grid) => {
  let totalScore = 0
  const newGrid = grid.map((row, rowIndex) => {
    const { row: newRow, score } = slideRowWithTracking(row, rowIndex)
    totalScore += score
    return newRow
  })
  return { grid: newGrid, score: totalScore }
}

const move = (grid, direction) => {
  const rotations = { left: 0, up: 1, right: 2, down: 3 }
  let rotated = rotateGrid(grid, rotations[direction])
  let { grid: moved, score } = moveLeft(rotated)
  let result = rotateGrid(moved, (4 - rotations[direction]) % 4)
  result = updateTilePositions(result)
  return { grid: result, score }
}

const gridsEqual = (a, b) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tileA = a[row][col]
      const tileB = b[row][col]
      if ((tileA === null) !== (tileB === null)) return false
      if (tileA && tileB && tileA.value !== tileB.value) return false
    }
  }
  return true
}

const canMove = (grid) => {
  for (let dir of ['left', 'right', 'up', 'down']) {
    const { grid: newGrid } = move(grid, dir)
    if (!gridsEqual(grid, newGrid)) return true
  }
  return false
}

const hasWon = (grid) =>
  grid.some(row => row.some(cell => cell && cell.value >= 2048))

// Clear animation flags for next move
const clearAnimationFlags = (grid) => {
  return grid.map(row =>
    row.map(tile => {
      if (tile === null) return null
      return {
        ...tile,
        isNew: false,
        isMerged: false,
        previousRow: null,
        previousCol: null,
      }
    })
  )
}

export function useGame2048() {
  const [grid, setGrid] = useState(() => {
    tileIdCounter = 0 // Reset counter on new game
    let g = createEmptyGrid()
    g = addRandomTile(g)
    g = addRandomTile(g)
    return g
  })
  const [score, setScore] = useState(0)
  const [scoreChange, setScoreChange] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('game2048HighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasWonGame, setHasWonGame] = useState(false)
  const animationTimeoutRef = useRef(null)

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('game2048HighScore', score.toString())
    }
  }, [score, highScore])

  // Clear animation flags after animation completes
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const handleMove = useCallback((direction) => {
    if (isGameOver) return

    setGrid(currentGrid => {
      // Clear previous animation flags first
      const cleanGrid = clearAnimationFlags(currentGrid)
      const { grid: newGrid, score: moveScore } = move(cleanGrid, direction)

      if (gridsEqual(cleanGrid, newGrid)) {
        return currentGrid
      }

      const gridWithNewTile = addRandomTile(newGrid)

      if (moveScore > 0) {
        setScoreChange(moveScore)
        // Clear score change after animation
        setTimeout(() => setScoreChange(0), 500)
      }

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
    tileIdCounter = 0 // Reset counter
    let g = createEmptyGrid()
    g = addRandomTile(g)
    g = addRandomTile(g)
    setGrid(g)
    setScore(0)
    setScoreChange(0)
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

  // Extract tiles as flat array for rendering
  const tiles = grid.flat().filter(tile => tile !== null)

  return {
    grid,
    tiles,
    score,
    scoreChange,
    highScore,
    isGameOver,
    hasWonGame,
    handleMove,
    resetGame,
  }
}
