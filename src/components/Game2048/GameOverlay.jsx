import React, { useEffect, useState } from 'react'

export default function GameOverlay({ isGameOver, hasWon, onReset }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isGameOver || hasWon) {
      setIsVisible(true)
      // Delay content animation
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setShowContent(false)
    }
  }, [isGameOver, hasWon])

  if (!isVisible) return null

  const isWin = hasWon && !isGameOver

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            }
            50% {
              box-shadow: 0 0 40px rgba(59, 130, 246, 0.8),
                          0 0 60px rgba(59, 130, 246, 0.4);
            }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isWin ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 300ms ease-out forwards',
          zIndex: 50,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            animation: showContent
              ? isWin
                ? 'slideUp 400ms ease-out forwards, pulse 2s ease-in-out infinite'
                : 'slideUp 400ms ease-out forwards, shake 500ms ease-out'
              : 'none',
            opacity: showContent ? 1 : 0,
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: isWin ? '#3b82f6' : '#ef4444',
              marginBottom: '8px',
              textShadow: isWin
                ? '0 0 20px rgba(59, 130, 246, 0.8)'
                : '0 0 10px rgba(239, 68, 68, 0.5)',
            }}
          >
            {isWin ? '🎉 Du hast gewonnen!' : 'Game Over'}
          </div>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {isWin ? 'Weiterspielen oder neu starten?' : 'Versuche es nochmal!'}
          </p>
          <button
            onClick={onReset}
            style={{
              padding: '12px 32px',
              backgroundColor: isWin ? '#3b82f6' : '#ef4444',
              border: 'none',
              borderRadius: '12px',
              color: '#f8fafc',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              animation: isWin ? 'glow 2s ease-in-out infinite' : 'none',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = isWin
                ? '0 0 30px rgba(59, 130, 246, 0.6)'
                : '0 0 20px rgba(239, 68, 68, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = ''
            }}
          >
            Neues Spiel
          </button>
        </div>
      </div>
    </>
  )
}
