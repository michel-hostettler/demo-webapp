import React from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

export default function Controls({ onMove, onReset }) {
  return (
    <div className="mt-4">
      {/* Direction controls */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          className="w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
          onClick={() => onMove('up')}
          aria-label="Nach oben"
          data-testid="btn-up"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex gap-2">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
            onClick={() => onMove('left')}
            aria-label="Nach links"
            data-testid="btn-left"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
            onClick={() => onMove('down')}
            aria-label="Nach unten"
            data-testid="btn-down"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-700 border border-slate-600 rounded-xl text-white flex items-center justify-center transition-all"
            onClick={() => onMove('right')}
            aria-label="Nach rechts"
            data-testid="btn-right"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Reset button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto"
          data-testid="btn-reset"
        >
          <RotateCcw className="w-4 h-4" />
          Neues Spiel
        </button>
      </div>

      <p className="text-slate-500 text-xs text-center mt-3">
        Pfeiltasten oder Buttons zum Bewegen
      </p>
    </div>
  )
}
