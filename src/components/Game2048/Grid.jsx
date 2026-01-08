import React from 'react'
import Tile from './Tile'

const GRID_SIZE = 4

export default function Grid({ tiles }) {
  return (
    <>
      <style>
        {`
          @keyframes tilePopIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes tileMerge {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .tile-new { animation: tilePopIn 150ms ease-out forwards; }
          .tile-merged { animation: tileMerge 200ms ease-out forwards; }

          .game-2048-grid {
            --tile-size: clamp(60px, 18vw, 80px);
            --gap-size: clamp(6px, 1.5vw, 10px);
          }
          @media (min-width: 640px) {
            .game-2048-grid {
              --tile-size: 75px;
              --gap-size: 10px;
            }
          }
        `}
      </style>
      <div
        className="game-2048-grid relative bg-slate-900 rounded-xl border border-slate-700"
        style={{
          width: 'calc(var(--tile-size) * 4 + var(--gap-size) * 3 + 16px)',
          height: 'calc(var(--tile-size) * 4 + var(--gap-size) * 3 + 16px)',
          padding: '8px',
        }}
        data-testid="game-grid"
      >
        {/* Background grid cells */}
        <div
          className="absolute grid"
          style={{
            top: '8px',
            left: '8px',
            gridTemplateColumns: `repeat(${GRID_SIZE}, var(--tile-size))`,
            gap: 'var(--gap-size)',
          }}
        >
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, index) => (
            <div
              key={`bg-${index}`}
              className="bg-slate-800 rounded-lg"
              style={{
                width: 'var(--tile-size)',
                height: 'var(--tile-size)',
              }}
            />
          ))}
        </div>

        {/* Animated tiles layer */}
        <div
          className="absolute"
          style={{
            top: '8px',
            left: '8px',
            width: 'calc(var(--tile-size) * 4 + var(--gap-size) * 3)',
            height: 'calc(var(--tile-size) * 4 + var(--gap-size) * 3)',
          }}
        >
          {tiles.map(tile => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </div>
      </div>
    </>
  )
}
