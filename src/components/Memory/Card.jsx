import React from 'react'

export default function Card({ card, onClick }) {
  const { symbol, isFlipped, isMatched } = card

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick()
    }
  }

  return (
    <div
      className="aspect-square w-full"
      onClick={handleClick}
      style={{
        perspective: '1000px',
        cursor: isFlipped || isMatched ? 'default' : 'pointer',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-blue-500 rounded-lg border-2 border-blue-400 shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-blue-800 text-xl sm:text-2xl font-bold">?</span>
        </div>

        {/* Card Front */}
        <div
          className={`absolute w-full h-full flex items-center justify-center rounded-lg border-2 shadow-lg ${
            isMatched
              ? 'bg-emerald-500 border-emerald-400'
              : 'bg-slate-800 border-slate-600'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: isMatched ? '0 0 15px rgba(16, 185, 129, 0.4)' : undefined,
          }}
        >
          <span className="text-2xl sm:text-3xl">{symbol}</span>
        </div>
      </div>
    </div>
  )
}
