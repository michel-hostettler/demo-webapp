import React from 'react'
import Tile from './Tile'

export default function Grid({ grid }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 65px)',
        gap: '8px',
        backgroundColor: '#0f172a',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid #334155',
      }}
      data-testid="game-grid"
    >
      {grid.flat().map((value, index) => (
        <Tile key={index} value={value} />
      ))}
    </div>
  )
}
