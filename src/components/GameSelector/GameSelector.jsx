import React from 'react'

const games = [
  {
    id: 'snake',
    name: 'Snake',
    emoji: '🐍',
    description: 'Klassisches Snake-Spiel',
    color: '#22c55e',
    colorClass: 'border-green-500 shadow-green-500/30',
    textClass: 'text-green-500',
  },
  {
    id: '2048',
    name: '2048',
    emoji: '🔢',
    description: 'Zahlen-Puzzle Klassiker',
    color: '#eab308',
    colorClass: 'border-amber-500 shadow-amber-500/30',
    textClass: 'text-amber-500',
  },
  {
    id: 'memory',
    name: 'Memory',
    emoji: '🃏',
    description: 'Finde alle Paare',
    color: '#3b82f6',
    colorClass: 'border-blue-500 shadow-blue-500/30',
    textClass: 'text-blue-500',
  },
]

export default function GameSelector({ selectedGame, onSelectGame }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 px-2">
      {games.map((game) => {
        const isSelected = selectedGame === game.id
        return (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`
              px-4 py-3 min-w-[100px] sm:min-w-[120px] rounded-xl cursor-pointer transition-all duration-200
              ${isSelected
                ? `bg-slate-800 border-2 ${game.colorClass} shadow-lg`
                : 'bg-slate-900/50 border-2 border-slate-700 hover:border-slate-600'
              }
            `}
            aria-label={`${game.name} auswählen`}
            data-testid={`game-btn-${game.id}`}
          >
            <div className="text-2xl sm:text-3xl mb-1">{game.emoji}</div>
            <div className={`font-semibold text-sm sm:text-base ${isSelected ? game.textClass : 'text-white'}`}>
              {game.name}
            </div>
            <div className="text-slate-500 text-[10px] sm:text-xs mt-0.5 hidden sm:block">
              {game.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
