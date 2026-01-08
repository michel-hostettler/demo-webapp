import React from 'react'

const games = [
  {
    id: 'snake',
    name: 'Snake',
    emoji: '🐍',
    description: 'Klassisches Snake-Spiel',
    color: '#22c55e',
  },
  {
    id: '2048',
    name: '2048',
    emoji: '🔢',
    description: 'Zahlen-Puzzle Klassiker',
    color: '#eab308',
  },
  {
    id: 'memory',
    name: 'Memory',
    emoji: '🃏',
    description: 'Finde alle Paare',
    color: '#3b82f6',
  },
]

export default function GameSelector({ selectedGame, onSelectGame }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelectGame(game.id)}
          style={{
            padding: '12px 20px',
            backgroundColor: selectedGame === game.id ? '#1e293b' : '#0f172a',
            border: `2px solid ${selectedGame === game.id ? game.color : '#334155'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '140px',
            boxShadow: selectedGame === game.id
              ? `0 0 20px ${game.color}30`
              : 'none',
          }}
          aria-label={`${game.name} auswählen`}
          data-testid={`game-btn-${game.id}`}
        >
          <div
            style={{
              fontSize: '28px',
              marginBottom: '4px',
            }}
          >
            {game.emoji}
          </div>
          <div
            style={{
              color: selectedGame === game.id ? game.color : '#f8fafc',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            {game.name}
          </div>
          <div
            style={{
              color: '#64748b',
              fontSize: '11px',
              marginTop: '2px',
            }}
          >
            {game.description}
          </div>
        </button>
      ))}
    </div>
  )
}
