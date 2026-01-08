import React, { useEffect, useState } from 'react'

function AnimatedScore({ score, label, color }) {
  const [displayScore, setDisplayScore] = useState(score)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true)
      // Animate to new score
      const diff = score - displayScore
      const steps = Math.min(Math.abs(diff), 10)
      const stepValue = diff / steps
      let current = displayScore
      let step = 0

      const interval = setInterval(() => {
        step++
        current += stepValue
        if (step >= steps) {
          setDisplayScore(score)
          setIsAnimating(false)
          clearInterval(interval)
        } else {
          setDisplayScore(Math.round(current))
        }
      }, 30)

      return () => clearInterval(interval)
    }
  }, [score, displayScore])

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        padding: '8px 20px',
        borderRadius: '8px',
        textAlign: 'center',
        border: '1px solid #334155',
        transition: 'transform 0.1s ease-out',
        transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
        {label}
      </div>
      <div
        style={{
          color: color,
          fontSize: '24px',
          fontWeight: 'bold',
          transition: 'all 0.15s ease-out',
        }}
      >
        {displayScore}
      </div>
    </div>
  )
}

function ScorePopup({ value }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || value <= 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        right: '0',
        color: '#22c55e',
        fontSize: '18px',
        fontWeight: 'bold',
        animation: 'scorePop 500ms ease-out forwards',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      +{value}
      <style>
        {`
          @keyframes scorePop {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-30px);
            }
          }
        `}
      </style>
    </div>
  )
}

export default function ScoreDisplay({ score, scoreChange, highScore, isGameOver, hasWon }) {
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
        <div style={{ position: 'relative' }}>
          <AnimatedScore score={score} label="SCORE" color="#f8fafc" />
          {scoreChange > 0 && <ScorePopup key={Date.now()} value={scoreChange} />}
        </div>
        <AnimatedScore score={highScore} label="BEST" color="#eab308" />
      </div>
    </div>
  )
}
