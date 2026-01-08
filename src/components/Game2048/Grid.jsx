import React from 'react'
import Tile from './Tile'

const TILE_SIZE = 65
const GAP_SIZE = 8
const GRID_SIZE = 4

// Calculate total grid size
const gridDimension = GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP_SIZE

export default function Grid({ tiles }) {
  return (
    <>
      {/* Global CSS animations for tiles */}
      <style>
        {`
          @keyframes tilePopIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes tileMerge {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }

          .tile-new {
            animation: tilePopIn 150ms ease-out forwards;
          }

          .tile-merged {
            animation: tileMerge 200ms ease-out forwards;
          }
        `}
      </style>
      <div
        style={{
          position: 'relative',
          width: `${gridDimension}px`,
          height: `${gridDimension}px`,
          backgroundColor: '#0f172a',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid #334155',
        }}
        data-testid="game-grid"
      >
        {/* Background grid cells */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            gap: `${GAP_SIZE}px`,
          }}
        >
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, index) => (
            <div
              key={`bg-${index}`}
              style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                backgroundColor: '#1e293b',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>

        {/* Animated tiles layer */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: `${gridDimension}px`,
            height: `${gridDimension}px`,
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
