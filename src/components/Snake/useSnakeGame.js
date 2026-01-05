import { useState, useCallback, useEffect, useRef } from 'react'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

function getRandomFood(snake) {
  let food
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y))
  return food
}

export function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(() => getRandomFood(INITIAL_SNAKE))
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved, 10) : 0
  })

  const directionRef = useRef(direction)
  const nextDirectionRef = useRef(null)

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const checkCollision = useCallback((head) => {
    // Wandkollision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    return false
  }, [])

  const checkSelfCollision = useCallback((head, body) => {
    return body.some((segment) => segment.x === head.x && segment.y === head.y)
  }, [])

  const moveSnake = useCallback(() => {
    setSnake((currentSnake) => {
      // Anstehende Richtungsänderung anwenden
      if (nextDirectionRef.current) {
        directionRef.current = nextDirectionRef.current
        setDirection(nextDirectionRef.current)
        nextDirectionRef.current = null
      }

      const currentDirection = directionRef.current
      const head = currentSnake[0]
      const newHead = {
        x: head.x + currentDirection.x,
        y: head.y + currentDirection.y,
      }

      // Kollisionsprüfung
      if (checkCollision(newHead) || checkSelfCollision(newHead, currentSnake)) {
        setIsGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      const newSnake = [newHead, ...currentSnake]

      // Futter essen
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem('snakeHighScore', newScore.toString())
          }
          return newScore
        })
        setFood(getRandomFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, highScore, checkCollision, checkSelfCollision])

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return

    const gameInterval = setInterval(moveSnake, GAME_SPEED)
    return () => clearInterval(gameInterval)
  }, [isPlaying, moveSnake])

  // Tastatursteuerung
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying && !isGameOver && e.key === ' ') {
        setIsPlaying(true)
        return
      }

      const current = directionRef.current
      let newDirection = null

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (current.y !== 1) newDirection = { x: 0, y: -1 }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (current.y !== -1) newDirection = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (current.x !== 1) newDirection = { x: -1, y: 0 }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (current.x !== -1) newDirection = { x: 1, y: 0 }
          break
        default:
          return
      }

      if (newDirection) {
        e.preventDefault()
        nextDirectionRef.current = newDirection
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isGameOver])

  const startGame = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pauseGame = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setFood(getRandomFood(INITIAL_SNAKE))
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    nextDirectionRef.current = null
    setIsPlaying(false)
    setIsGameOver(false)
    setScore(0)
  }, [])

  const changeDirection = useCallback((newDirection) => {
    const current = directionRef.current

    // Keine 180-Grad-Wendung erlauben
    if (
      (newDirection.x === 0 && newDirection.y === -1 && current.y === 1) ||
      (newDirection.x === 0 && newDirection.y === 1 && current.y === -1) ||
      (newDirection.x === -1 && newDirection.y === 0 && current.x === 1) ||
      (newDirection.x === 1 && newDirection.y === 0 && current.x === -1)
    ) {
      return
    }

    nextDirectionRef.current = newDirection
  }, [])

  return {
    snake,
    food,
    isPlaying,
    isGameOver,
    score,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  }
}
