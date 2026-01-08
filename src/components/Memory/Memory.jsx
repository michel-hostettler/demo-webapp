import React from 'react'
import { useMemoryGame } from './useMemoryGame'
import Card from './Card'
import { RotateCcw, Trophy, Zap } from 'lucide-react'

export default function Memory({ onBack }) {
  const {
    cards,
    moves,
    matches,
    bestScore,
    isGameWon,
    handleCardClick,
    resetGame,
  } = useMemoryGame()

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm">
        <button
          onClick={onBack}
          className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all text-sm"
        >
          ← Zurück
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Memory</h1>
        <button
          onClick={resetGame}
          className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all"
          aria-label="Neues Spiel"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 sm:gap-6">
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400 text-sm">Züge:</span>
          <span className="text-white font-bold">{moves}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 text-sm">Best:</span>
          <span className="text-white font-bold">{bestScore ?? '-'}</span>
        </div>
      </div>

      {/* Matches counter */}
      <div className="text-slate-400 text-sm">
        Paare gefunden: <span className="text-emerald-400 font-bold">{matches}</span> / 8
      </div>

      {/* Game Grid */}
      <div
        className="grid grid-cols-4 gap-2 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50"
        style={{ touchAction: 'manipulation' }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {/* Win Message */}
      {isGameWon && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 text-center animate-pulse">
          <p className="text-emerald-400 font-bold text-lg">
            🎉 Gewonnen!
          </p>
          <p className="text-slate-300 text-sm mt-1">
            Du hast es in {moves} Zügen geschafft!
          </p>
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all text-sm font-medium"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-slate-500 text-xs text-center max-w-xs">
        Finde alle 8 Paare! Klicke auf eine Karte um sie umzudrehen.
      </div>
    </div>
  )
}
