import React from 'react'

export default function Controls({ onMove, onReset }) {
  const buttonStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <button
          style={buttonStyle}
          onClick={() => onMove('up')}
          aria-label="Nach oben"
          data-testid="btn-up"
        >
          ↑
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={buttonStyle}
            onClick={() => onMove('left')}
            aria-label="Nach links"
            data-testid="btn-left"
          >
            ←
          </button>
          <button
            style={buttonStyle}
            onClick={() => onMove('down')}
            aria-label="Nach unten"
            data-testid="btn-down"
          >
            ↓
          </button>
          <button
            style={buttonStyle}
            onClick={() => onMove('right')}
            aria-label="Nach rechts"
            data-testid="btn-right"
          >
            →
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onReset}
          style={{
            padding: '10px 24px',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            color: '#f8fafc',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          data-testid="btn-reset"
        >
          Neues Spiel
        </button>
      </div>

      <p
        style={{
          color: '#64748b',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '12px',
        }}
      >
        Pfeiltasten oder Buttons zum Bewegen
      </p>
    </div>
  )
}
