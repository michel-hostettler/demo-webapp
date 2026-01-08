import React from 'react'

export default function ScoreDisplay({ score, highScore, isGameOver, hasWon }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            backgroundColor: '#1e293b',
            padding: '8px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #334155',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
            SCORE
          </div>
          <div style={{ color: '#f8fafc', fontSize: '24px', fontWeight: 'bold' }}>
            {score}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#1e293b',
            padding: '8px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #334155',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
            BEST
          </div>
          <div style={{ color: '#eab308', fontSize: '24px', fontWeight: 'bold' }}>
            {highScore}
          </div>
        </div>
      </div>

      {(isGameOver || hasWon) && (
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            backgroundColor: isGameOver ? '#dc262620' : '#22c55e20',
            borderRadius: '8px',
            border: `1px solid ${isGameOver ? '#dc2626' : '#22c55e'}`,
          }}
        >
          <span
            style={{
              color: isGameOver ? '#ef4444' : '#22c55e',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {isGameOver ? 'Game Over!' : 'You Won! Keep going?'}
          </span>
        </div>
      )}
    </div>
  )
}
