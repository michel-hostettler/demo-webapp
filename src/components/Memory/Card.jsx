import React from 'react'

export default function Card({ card, onClick }) {
  const { symbol, isFlipped, isMatched } = card

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick()
    }
  }

  return (
    <div
      className="card-container"
      onClick={handleClick}
      style={{
        perspective: '1000px',
        width: '65px',
        height: '65px',
        cursor: isFlipped || isMatched ? 'default' : 'pointer',
      }}
    >
      <div
        className={`card-inner ${isFlipped || isMatched ? 'flipped' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.4s ease-out',
          transformStyle: 'preserve-3d',
          transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        {/* Card Back */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#3b82f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #60a5fa',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '24px', color: '#1e40af' }}>?</span>
        </div>

        {/* Card Front */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: isMatched ? '#10b981' : '#1e293b',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${isMatched ? '#34d399' : '#334155'}`,
            boxShadow: isMatched
              ? '0 0 15px rgba(16, 185, 129, 0.4)'
              : '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '28px' }}>{symbol}</span>
        </div>
      </div>
    </div>
  )
}
