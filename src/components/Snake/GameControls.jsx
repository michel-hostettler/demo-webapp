import React from 'react'

export default function GameControls({
  isPlaying,
  isGameOver,
  score,
  onStart,
  onPause,
  onReset,
  onDirectionChange,
}) {
  const showResetButton = isGameOver || (!isPlaying && score > 0)

  return (
    <div className="snake-controls">
      {/* Desktop/Keyboard Instructions */}
      <p className="snake-instructions" style={{
        color: '#94a3b8',
        fontSize: '14px',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Steuerung: Pfeiltasten oder WASD
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        {!isPlaying && !isGameOver && (
          <button
            onClick={onStart}
            className="snake-btn snake-btn-primary"
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            aria-label="Spiel starten"
          >
            Start
          </button>
        )}

        {isPlaying && (
          <button
            onClick={onPause}
            className="snake-btn snake-btn-secondary"
            style={{
              padding: '10px 24px',
              backgroundColor: '#475569',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            aria-label="Spiel pausieren"
          >
            Pause
          </button>
        )}

        {showResetButton && (
          <button
            onClick={onReset}
            className="snake-btn snake-btn-primary"
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            aria-label="Neues Spiel starten"
          >
            Neu starten
          </button>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div
        className="snake-touch-controls"
        style={{
          display: 'grid',
          gridTemplateAreas: `
            ". up ."
            "left . right"
            ". down ."
          `,
          gridTemplateColumns: 'repeat(3, 50px)',
          gridTemplateRows: 'repeat(3, 50px)',
          gap: '4px',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => onDirectionChange({ x: 0, y: -1 })}
          style={{
            gridArea: 'up',
            backgroundColor: '#334155',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Nach oben"
        >
          ^
        </button>
        <button
          onClick={() => onDirectionChange({ x: -1, y: 0 })}
          style={{
            gridArea: 'left',
            backgroundColor: '#334155',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Nach links"
        >
          &lt;
        </button>
        <button
          onClick={() => onDirectionChange({ x: 1, y: 0 })}
          style={{
            gridArea: 'right',
            backgroundColor: '#334155',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Nach rechts"
        >
          &gt;
        </button>
        <button
          onClick={() => onDirectionChange({ x: 0, y: 1 })}
          style={{
            gridArea: 'down',
            backgroundColor: '#334155',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Nach unten"
        >
          v
        </button>
      </div>
    </div>
  )
}
