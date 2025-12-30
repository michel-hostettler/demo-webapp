import React, { useState, useEffect, useCallback, useRef } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 50

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

const QA_MESSAGES = [
  "App Crashed! Time to debug...",
  "Production Down! CEO is calling...",
  "Memory Leak Detected!",
  "Null Pointer Exception!",
  "Stack Overflow Error!"
]

const getRandomPosition = (snake) => {
  let position
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y))
  return position
}

const getInitialState = () => ({
  snake: [{ x: 10, y: 10 }],
  direction: DIRECTIONS.RIGHT,
  bug: { x: 15, y: 10 },
  score: 0,
  gameOver: false,
  gameOverMessage: '',
  isPaused: false,
  speed: INITIAL_SPEED
})

export default function SnakeGame() {
  const [gameState, setGameState] = useState(getInitialState)
  const [isPlaying, setIsPlaying] = useState(false)
  const directionRef = useRef(gameState.direction)
  const gameLoopRef = useRef(null)

  const resetGame = useCallback(() => {
    const initial = getInitialState()
    setGameState(initial)
    directionRef.current = initial.direction
    setIsPlaying(false)
  }, [])

  const startGame = useCallback(() => {
    if (gameState.gameOver) {
      resetGame()
    }
    setIsPlaying(true)
    setGameState(prev => ({ ...prev, isPaused: false }))
  }, [gameState.gameOver, resetGame])

  const togglePause = useCallback(() => {
    if (!gameState.gameOver && isPlaying) {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
    }
  }, [gameState.gameOver, isPlaying])

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      if (!isPlaying || gameState.gameOver) {
        startGame()
      } else {
        togglePause()
      }
      return
    }

    if (gameState.isPaused || gameState.gameOver || !isPlaying) return

    const currentDir = directionRef.current
    let newDirection = null

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== DIRECTIONS.DOWN) newDirection = DIRECTIONS.UP
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== DIRECTIONS.UP) newDirection = DIRECTIONS.DOWN
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== DIRECTIONS.RIGHT) newDirection = DIRECTIONS.LEFT
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== DIRECTIONS.LEFT) newDirection = DIRECTIONS.RIGHT
        break
      default:
        return
    }

    if (newDirection) {
      e.preventDefault()
      directionRef.current = newDirection
      setGameState(prev => ({ ...prev, direction: newDirection }))
    }
  }, [gameState.isPaused, gameState.gameOver, isPlaying, startGame, togglePause])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!isPlaying || gameState.isPaused || gameState.gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const head = prev.snake[0]
        const direction = directionRef.current
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y
        }

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
            newHead.y < 0 || newHead.y >= GRID_SIZE) {
          return {
            ...prev,
            gameOver: true,
            gameOverMessage: QA_MESSAGES[Math.floor(Math.random() * QA_MESSAGES.length)]
          }
        }

        // Self collision
        if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          return {
            ...prev,
            gameOver: true,
            gameOverMessage: QA_MESSAGES[Math.floor(Math.random() * QA_MESSAGES.length)]
          }
        }

        // Bug collision (eating)
        const ateBug = newHead.x === prev.bug.x && newHead.y === prev.bug.y
        const newSnake = [newHead, ...prev.snake]

        if (!ateBug) {
          newSnake.pop()
        }

        return {
          ...prev,
          snake: newSnake,
          bug: ateBug ? getRandomPosition(newSnake) : prev.bug,
          score: ateBug ? prev.score + 10 : prev.score,
          speed: ateBug ? Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT) : prev.speed
        }
      })
    }, gameState.speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameState.isPaused, gameState.gameOver, gameState.speed])

  return (
    <div className="snake-game">
      <div className="snake-header">
        <h2>QA Bug Hunter</h2>
        <div className="snake-score">
          <span className="score-label">Bugs Squashed:</span>
          <span className="score-value">{gameState.score}</span>
        </div>
      </div>

      <div
        className="snake-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {gameState.snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2
            }}
          >
            {index === 0 && '🔍'}
          </div>
        ))}

        <div
          className="bug"
          style={{
            left: gameState.bug.x * CELL_SIZE,
            top: gameState.bug.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2
          }}
        >
          🐛
        </div>

        {!isPlaying && !gameState.gameOver && (
          <div className="snake-overlay">
            <div className="overlay-content">
              <h3>QA Bug Hunter</h3>
              <p>Catch all the bugs!</p>
              <button onClick={startGame} className="snake-btn primary">
                Start Hunting
              </button>
            </div>
          </div>
        )}

        {gameState.isPaused && (
          <div className="snake-overlay">
            <div className="overlay-content">
              <h3>Paused</h3>
              <p>Coffee break?</p>
              <button onClick={togglePause} className="snake-btn primary">
                Resume
              </button>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="snake-overlay game-over">
            <div className="overlay-content">
              <h3>{gameState.gameOverMessage}</h3>
              <p>Bugs Squashed: {gameState.score}</p>
              <button onClick={startGame} className="snake-btn primary">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="snake-controls">
        <p className="controls-hint">
          <kbd>WASD</kbd> or <kbd>Arrow Keys</kbd> to move | <kbd>Space</kbd> to pause
        </p>
      </div>
    </div>
  )
}
