import { useState, useCallback, useEffect, useRef } from 'react'

const GRID_SIZE = 4
const SLIDE_DURATION = 150

let tileIdCounter = 0
const getNextTileId = () => ++tileIdCounter

// Create tile object with unique ID
const createTile = (value, row, col) => ({
  id: getNextTileId(),
  value,
  row,
  col,
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

// Slide row to the left and merge
const slideRowLeft = (row) => {
  // Filter out empty cells
  const tiles = row.filter(tile => tile !== null)
  const result = []
  let score = 0

  let i = 0
  while (i < tiles.length) {
    if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
      // Merge two tiles
      const mergedValue = tiles[i].value * 2
      const mergedTile = {
        id: getNextTileId(),
        value: mergedValue,
        row: 0, // Will be updated later
        col: result.length,
        isNew: false,
        isMerged: true,
      }
      result.push(mergedTile)
      score += mergedValue
      i += 2 // Skip both merged tiles
    } else {
      // Move tile without merge
      const movedTile = {
        ...tiles[i],
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

// Rotate grid 90 degrees clockwise
const rotateGridCW = (grid) => {
  return grid[0].map((_, colIndex) =>
    grid.map(row => row[colIndex]).reverse()
  )
}

// Rotate grid 90 degrees counter-clockwise
const rotateGridCCW = (grid) => {
  return grid[0].map((_, colIndex) =>
    grid.map(row => row[GRID_SIZE - 1 - colIndex])
  )
}

// Move all tiles left
const moveLeft = (grid) => {
  let totalScore = 0
  const newGrid = grid.map((row, rowIndex) => {
    const { row: newRow, score } = slideRowLeft(row)
    totalScore += score
    // Update row index for all tiles
    return newRow.map(tile => {
      if (tile === null) return null
      return { ...tile, row: rowIndex }
    })
  })
  return { grid: newGrid, score: totalScore }
}

// Move in any direction by rotating, moving left, then rotating back
const move = (grid, direction) => {
  let workingGrid = grid

  // Rotate to make all moves work as "left"
  switch (direction) {
    case 'up':
      workingGrid = rotateGridCCW(workingGrid)
      break
    case 'right':
      workingGrid = rotateGridCW(rotateGridCW(workingGrid))
      break
    case 'down':
      workingGrid = rotateGridCW(workingGrid)
      break
    default: // left
      break
  }

  // Perform move left
  const { grid: movedGrid, score } = moveLeft(workingGrid)

  // Rotate back
  let resultGrid = movedGrid
  switch (direction) {
    case 'up':
      resultGrid = rotateGridCW(movedGrid)
      break
    case 'right':
      resultGrid = rotateGridCW(rotateGridCW(movedGrid))
      break
    case 'down':
      resultGrid = rotateGridCCW(movedGrid)
      break
    default: // left
      break
  }

  // Update all tile positions to match their actual grid positions
  resultGrid = resultGrid.map((row, rowIndex) =>
    row.map((tile, colIndex) => {
      if (tile === null) return null
      return { ...tile, row: rowIndex, col: colIndex }
    })
  )

  return { grid: resultGrid, score }
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
      // Clear previous animation flags first
      const cleanGrid = clearAnimationFlags(currentGrid)
      const { grid: newGrid, score: moveScore } = move(cleanGrid, direction)

      if (gridsEqual(cleanGrid, newGrid)) {
        isAnimatingRef.current = false
        return currentGrid
      }

      if (moveScore > 0) {
        setScoreChange(moveScore)
        // Clear score change after animation
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
