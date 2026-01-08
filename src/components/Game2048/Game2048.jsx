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
    <div
      className="card game-2048"
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '350px',
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
        <span style={{ color: '#eab308' }}>2048</span>
      </h2>

      <ScoreDisplay
        score={score}
        scoreChange={scoreChange}
        highScore={highScore}
        isGameOver={isGameOver}
        hasWon={hasWonGame}
      />

      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
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
