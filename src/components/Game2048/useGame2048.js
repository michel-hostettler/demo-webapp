import { useState, useCallback, useEffect, useRef } from 'react'

const GRID_SIZE = 4
const SLIDE_DURATION = 150

let tileIdCounter = 0
const getNextTileId = () => ++tileIdCounter

// Create tile object with unique ID and position tracking
const createTile = (value, row, col) => ({
  id: getNextTileId(),
  value,
  row,
  col,
  previousRow: row,
  previousCol: col,
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

// Slide row to the left and merge - returns tiles with correct column positions
const slideRowLeft = (row, rowIndex) => {
  // Filter out empty cells and prepare tiles with their previous positions
  const tiles = row.filter(tile => tile !== null).map(tile => ({
    ...tile,
    previousRow: tile.row,
    previousCol: tile.col,
  }))

  const result = []
  let score = 0
  let i = 0

  while (i < tiles.length) {
    if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
      // Merge two tiles - keep the first tile's ID for continuity
      const mergedValue = tiles[i].value * 2
      const mergedTile = {
        id: tiles[i].id, // Keep original ID for animation continuity
        value: mergedValue,
        row: rowIndex,
        col: result.length,
        previousRow: tiles[i].previousRow,
        previousCol: tiles[i].previousCol,
        isNew: false,
        isMerged: true,
        mergedFromId: tiles[i + 1].id, // Track which tile was absorbed
      }
      result.push(mergedTile)
      score += mergedValue
      i += 2 // Skip both merged tiles
    } else {
      // Move tile without merge
      const movedTile = {
        ...tiles[i],
        row: rowIndex,
        col: result.length,
        isNew: false,
        isMerged: false,
      }
      result.push(movedTile)
      i++
    }
  }

  // Fill remaining with null
  while (result.length < GRID_SIZE) {
    result.push(null)
  }

  return { row: result, score }
}

// Move all tiles left - this is the core movement function
const moveLeft = (grid) => {
  let totalScore = 0
  const newGrid = grid.map((row, rowIndex) => {
    const { row: newRow, score } = slideRowLeft(row, rowIndex)
    totalScore += score
    return newRow
  })
  return { grid: newGrid, score: totalScore }
}

// Transform grid for different directions
// For UP: rotate CCW, move left, rotate CW
// For DOWN: rotate CW, move left, rotate CCW
// For RIGHT: rotate 180, move left, rotate 180

const moveUp = (grid) => {
  // For UP movement: we transpose so columns become rows, then move left, then transpose back
  // This way, column 0 becomes row 0, etc.
  const transposed = []
  for (let col = 0; col < GRID_SIZE; col++) {
    const newRow = []
    for (let row = 0; row < GRID_SIZE; row++) {
      const tile = grid[row][col]
      if (tile) {
        newRow.push({
          ...tile,
          // Store original position before transformation
          previousRow: tile.row,
          previousCol: tile.col,
        })
      } else {
        newRow.push(null)
      }
    }
    transposed.push(newRow)
  }

  // Move left on transposed grid
  let totalScore = 0
  const movedTransposed = transposed.map((row, colIndex) => {
    const { row: newRow, score } = slideRowLeft(row, colIndex)
    totalScore += score
    return newRow
  })

  // Transpose back and fix positions
  const result = createEmptyGrid()
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      const tile = movedTransposed[col][row]
      if (tile) {
        result[row][col] = {
          ...tile,
          row: row,
          col: col,
          // previousRow and previousCol are already set correctly from the original tile
        }
      }
    }
  }

  return { grid: result, score: totalScore }
}

const moveDown = (grid) => {
  // For DOWN: reverse each column, move as up (transpose), then reverse back
  const transposed = []
  for (let col = 0; col < GRID_SIZE; col++) {
    const newRow = []
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      const tile = grid[row][col]
      if (tile) {
        newRow.push({
          ...tile,
          previousRow: tile.row,
          previousCol: tile.col,
        })
      } else {
        newRow.push(null)
      }
    }
    transposed.push(newRow)
  }

  // Move left on transposed grid
  let totalScore = 0
  const movedTransposed = transposed.map((row, colIndex) => {
    const { row: newRow, score } = slideRowLeft(row, colIndex)
    totalScore += score
    return newRow
  })

  // Transpose back and reverse - fix positions
  const result = createEmptyGrid()
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      const tile = movedTransposed[col][i]
      const actualRow = GRID_SIZE - 1 - i
      if (tile) {
        result[actualRow][col] = {
          ...tile,
          row: actualRow,
          col: col,
        }
      }
    }
  }

  return { grid: result, score: totalScore }
}

const moveRight = (grid) => {
  // For RIGHT: reverse each row, move left, then reverse back
  let totalScore = 0
  const newGrid = grid.map((row, rowIndex) => {
    // Reverse the row, preserving tile info
    const reversedRow = [...row].reverse().map(tile => {
      if (tile) {
        return {
          ...tile,
          previousRow: tile.row,
          previousCol: tile.col,
        }
      }
      return null
    })

    const { row: movedRow, score } = slideRowLeft(reversedRow, rowIndex)
    totalScore += score

    // Reverse back and fix column positions
    const finalRow = [...movedRow].reverse()
    return finalRow.map((tile, colIndex) => {
      if (tile) {
        return {
          ...tile,
          row: rowIndex,
          col: colIndex,
        }
      }
      return null
    })
  })

  return { grid: newGrid, score: totalScore }
}

// Main move function that delegates to direction-specific handlers
const move = (grid, direction) => {
  // First, save current positions as previous positions for all tiles
  const preparedGrid = grid.map(row =>
    row.map(tile => {
      if (tile === null) return null
      return {
        ...tile,
        previousRow: tile.row,
        previousCol: tile.col,
        isNew: false,
        isMerged: false,
      }
    })
  )

  switch (direction) {
    case 'up':
      return moveUp(preparedGrid)
    case 'down':
      return moveDown(preparedGrid)
    case 'right':
      return moveRight(preparedGrid)
    case 'left':
    default:
      return moveLeft(preparedGrid)
  }
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
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('game2048HighScore', score.toString())
    }
  }, [score, highScore])

  const handleMove = useCallback((direction) => {
    if (isGameOver || isAnimatingRef.current) return

    // Mark as animating to prevent rapid moves
    isAnimatingRef.current = true

    setGrid(currentGrid => {
      const { grid: newGrid, score: moveScore } = move(currentGrid, direction)

      if (gridsEqual(currentGrid, newGrid)) {
        isAnimatingRef.current = false
        return currentGrid
      }

      if (moveScore > 0) {
        setScoreChange(moveScore)
        setTimeout(() => setScoreChange(0), 500)
      }

      setScore(s => s + moveScore)

      // After slide animation completes, add new tile
      setTimeout(() => {
        setGrid(gridAfterSlide => {
          const gridWithNewTile = addRandomTile(gridAfterSlide)

          if (hasWon(gridWithNewTile) && !hasWonGame) {
            setHasWonGame(true)
          }

          if (!canMove(gridWithNewTile)) {
            setIsGameOver(true)
          }

          // Allow next move after new tile appears
          setTimeout(() => {
            isAnimatingRef.current = false
          }, 50)

          return gridWithNewTile
        })
      }, SLIDE_DURATION)

      return newGrid
    })
  }, [isGameOver, hasWonGame])

  const resetGame = useCallback(() => {
    tileIdCounter = 0 // Reset counter
    isAnimatingRef.current = false
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
