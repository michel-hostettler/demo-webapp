import React from 'react'

export default function ScoreBoard({ score, highScore, isGameOver }) {
  return (
    <div
      className="snake-scoreboard"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        marginBottom: '16px',
        border: '1px solid #334155',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
          Punkte
        </div>
        <div
          style={{
            color: '#22c55e',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
          }}
        >
          {score}
        </div>
      </div>

      <div
        style={{
          width: '1px',
          height: '40px',
          backgroundColor: '#334155',
        }}
      />

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
          Highscore
        </div>
        <div
          style={{
            color: '#f59e0b',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
          }}
        >
          {highScore}
        </div>
      </div>

      {isGameOver && (
        <>
          <div
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#334155',
            }}
          />
          <div
            style={{
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            GAME OVER
          </div>
        </>
      )}
    </div>
  )
}
