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

// Direct implementation for LEFT movement
const moveLeft = (grid) => {
  const newGrid = createEmptyGrid()
  let totalScore = 0

  for (let row = 0; row < GRID_SIZE; row++) {
    const tiles = []
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        tiles.push({
          ...grid[row][col],
          previousRow: row,
          previousCol: col,
        })
      }
    }

    let targetCol = 0
    let i = 0
    while (i < tiles.length) {
      const currentTile = tiles[i]
      if (i + 1 < tiles.length && currentTile.value === tiles[i + 1].value) {
        const mergedValue = currentTile.value * 2
        newGrid[row][targetCol] = {
          id: currentTile.id,
          value: mergedValue,
          row: row,
          col: targetCol,
          previousRow: currentTile.previousRow,
          previousCol: currentTile.previousCol,
          isNew: false,
          isMerged: true,
        }
        totalScore += mergedValue
        i += 2
      } else {
        newGrid[row][targetCol] = {
          ...currentTile,
          row: row,
          col: targetCol,
          isNew: false,
          isMerged: false,
        }
        i++
      }
      targetCol++
    }
  }

  return { grid: newGrid, score: totalScore }
}

// Direct implementation for RIGHT movement
const moveRight = (grid) => {
  const newGrid = createEmptyGrid()
  let totalScore = 0

  for (let row = 0; row < GRID_SIZE; row++) {
    const tiles = []
    for (let col = GRID_SIZE - 1; col >= 0; col--) {
      if (grid[row][col] !== null) {
        tiles.push({
          ...grid[row][col],
          previousRow: row,
          previousCol: col,
        })
      }
    }

    let targetCol = GRID_SIZE - 1
    let i = 0
    while (i < tiles.length) {
      const currentTile = tiles[i]
      if (i + 1 < tiles.length && currentTile.value === tiles[i + 1].value) {
        const mergedValue = currentTile.value * 2
        newGrid[row][targetCol] = {
          id: currentTile.id,
          value: mergedValue,
          row: row,
          col: targetCol,
          previousRow: currentTile.previousRow,
          previousCol: currentTile.previousCol,
          isNew: false,
          isMerged: true,
        }
        totalScore += mergedValue
        i += 2
      } else {
        newGrid[row][targetCol] = {
          ...currentTile,
          row: row,
          col: targetCol,
          isNew: false,
          isMerged: false,
        }
        i++
      }
      targetCol--
    }
  }

  return { grid: newGrid, score: totalScore }
}

// Direct implementation for UP movement
const moveUp = (grid) => {
  const newGrid = createEmptyGrid()
  let totalScore = 0

  for (let col = 0; col < GRID_SIZE; col++) {
    const tiles = []
    for (let row = 0; row < GRID_SIZE; row++) {
      if (grid[row][col] !== null) {
        tiles.push({
          ...grid[row][col],
          previousRow: row,
          previousCol: col,
        })
      }
    }

    let targetRow = 0
    let i = 0
    while (i < tiles.length) {
      const currentTile = tiles[i]
      if (i + 1 < tiles.length && currentTile.value === tiles[i + 1].value) {
        const mergedValue = currentTile.value * 2
        newGrid[targetRow][col] = {
          id: currentTile.id,
          value: mergedValue,
          row: targetRow,
          col: col,
          previousRow: currentTile.previousRow,
          previousCol: currentTile.previousCol,
          isNew: false,
          isMerged: true,
        }
        totalScore += mergedValue
        i += 2
      } else {
        newGrid[targetRow][col] = {
          ...currentTile,
          row: targetRow,
          col: col,
          isNew: false,
          isMerged: false,
        }
        i++
      }
      targetRow++
    }
  }

  return { grid: newGrid, score: totalScore }
}

// Direct implementation for DOWN movement
const moveDown = (grid) => {
  const newGrid = createEmptyGrid()
  let totalScore = 0

  for (let col = 0; col < GRID_SIZE; col++) {
    const tiles = []
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (grid[row][col] !== null) {
        tiles.push({
          ...grid[row][col],
          previousRow: row,
          previousCol: col,
        })
      }
    }

    let targetRow = GRID_SIZE - 1
    let i = 0
    while (i < tiles.length) {
      const currentTile = tiles[i]
      if (i + 1 < tiles.length && currentTile.value === tiles[i + 1].value) {
        const mergedValue = currentTile.value * 2
        newGrid[targetRow][col] = {
          id: currentTile.id,
          value: mergedValue,
          row: targetRow,
          col: col,
          previousRow: currentTile.previousRow,
          previousCol: currentTile.previousCol,
          isNew: false,
          isMerged: true,
        }
        totalScore += mergedValue
        i += 2
      } else {
        newGrid[targetRow][col] = {
          ...currentTile,
          row: targetRow,
          col: col,
          isNew: false,
          isMerged: false,
        }
        i++
      }
      targetRow--
    }
  }

  return { grid: newGrid, score: totalScore }
}

// Main move function
const move = (grid, direction) => {
  switch (direction) {
    case 'up':
      return moveUp(grid)
    case 'down':
      return moveDown(grid)
    case 'right':
      return moveRight(grid)
    case 'left':
    default:
      return moveLeft(grid)
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
