import React from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react'

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
    <div>
      {/* Desktop/Keyboard Instructions */}
      <p className="text-slate-400 text-xs sm:text-sm text-center mb-3">
        Steuerung: Pfeiltasten oder WASD
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center mb-4">
        {!isPlaying && !isGameOver && (
          <button
            onClick={onStart}
            className="px-5 py-2.5 min-h-[44px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            aria-label="Spiel starten"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        )}

        {isPlaying && (
          <button
            onClick={onPause}
            className="px-5 py-2.5 min-h-[44px] bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            aria-label="Spiel pausieren"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}

        {showResetButton && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 min-h-[44px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            aria-label="Neues Spiel starten"
          >
            <RotateCcw className="w-4 h-4" />
            Neu starten
          </button>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div
        className="grid justify-center"
        style={{
          gridTemplateAreas: `
            ". up ."
            "left . right"
            ". down ."
          `,
          gridTemplateColumns: 'repeat(3, 52px)',
          gridTemplateRows: 'repeat(3, 52px)',
          gap: '6px',
        }}
      >
        <button
          onClick={() => onDirectionChange({ x: 0, y: -1 })}
          className="min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
          style={{ gridArea: 'up' }}
          aria-label="Nach oben"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDirectionChange({ x: -1, y: 0 })}
          className="min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
          style={{ gridArea: 'left' }}
          aria-label="Nach links"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDirectionChange({ x: 1, y: 0 })}
          className="min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
          style={{ gridArea: 'right' }}
          aria-label="Nach rechts"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDirectionChange({ x: 0, y: 1 })}
          className="min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
          style={{ gridArea: 'down' }}
          aria-label="Nach unten"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
