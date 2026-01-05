import React from 'react'
import { useSnakeGame } from './useSnakeGame'
import GameBoard from './GameBoard'
import ScoreBoard from './ScoreBoard'
import GameControls from './GameControls'

export default function Snake() {
  const {
    snake,
    food,
    isPlaying,
    isGameOver,
    score,
    highScore,
    gridSize,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  } = useSnakeGame()

  return (
    <div
      className="card snake-game"
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '450px',
        margin: '0 auto',
        border: '1px solid #334155',
      }}
    >
      <h2
        style={{
          color: '#f8fafc',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span role="img" aria-label="Schlange">🐍</span>
        Snake
      </h2>

      <ScoreBoard score={score} highScore={highScore} isGameOver={isGameOver} />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <GameBoard snake={snake} food={food} gridSize={gridSize} />
      </div>

      <GameControls
        isPlaying={isPlaying}
        isGameOver={isGameOver}
        score={score}
        onStart={startGame}
        onPause={pauseGame}
        onReset={resetGame}
        onDirectionChange={changeDirection}
      />
    </div>
  )
}
