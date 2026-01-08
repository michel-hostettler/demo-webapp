import React from 'react'

export default function ScoreBoard({ score, highScore, isGameOver }) {
  return (
    <div className="flex justify-around items-center px-4 py-3 bg-slate-800/50 rounded-xl mb-4 border border-slate-700/50">
      <div className="text-center">
        <div className="text-slate-400 text-xs uppercase tracking-wide">Punkte</div>
        <div className="text-green-500 text-xl sm:text-2xl font-bold font-mono">{score}</div>
      </div>

      <div className="w-px h-10 bg-slate-700" />

      <div className="text-center">
        <div className="text-slate-400 text-xs uppercase tracking-wide">Highscore</div>
        <div className="text-amber-500 text-xl sm:text-2xl font-bold font-mono">{highScore}</div>
      </div>

      {isGameOver && (
        <>
          <div className="w-px h-10 bg-slate-700" />
          <div className="text-red-500 text-sm sm:text-base font-bold text-center">
            GAME OVER
          </div>
        </>
      )}
    </div>
  )
}
