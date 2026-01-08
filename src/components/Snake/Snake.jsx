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
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2 text-white">
        <span role="img" aria-label="Schlange">🐍</span>
        Snake
      </h2>

      <ScoreBoard score={score} highScore={highScore} isGameOver={isGameOver} />

      <div className="flex justify-center mb-4">
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
