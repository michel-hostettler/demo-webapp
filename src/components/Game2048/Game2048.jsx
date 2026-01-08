import React from 'react'
import { useGame2048 } from './useGame2048'
import Grid from './Grid'
import ScoreDisplay from './ScoreDisplay'
import Controls from './Controls'
import GameOverlay from './GameOverlay'

export default function Game2048() {
  const {
    tiles,
    score,
    scoreChange,
    highScore,
    isGameOver,
    hasWonGame,
    handleMove,
    resetGame,
  } = useGame2048()

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 w-full max-w-sm mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <span className="text-amber-400">2048</span>
      </h2>

      <ScoreDisplay
        score={score}
        scoreChange={scoreChange}
        highScore={highScore}
        isGameOver={isGameOver}
        hasWon={hasWonGame}
      />

      <div className="flex justify-center relative">
        <Grid tiles={tiles} />
        <GameOverlay
          isGameOver={isGameOver}
          hasWon={hasWonGame}
          onReset={resetGame}
        />
      </div>

      <Controls onMove={handleMove} onReset={resetGame} />
    </div>
  )
}
