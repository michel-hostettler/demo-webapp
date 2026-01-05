import React from 'react'

export default function GameBoard({ snake, food, gridSize }) {
  const cellSize = 100 / gridSize

  return (
    <div
      className="snake-board"
      role="img"
      aria-label="Snake Spielfeld"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '1px',
        aspectRatio: '1',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '4px',
        border: '2px solid #334155',
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize
        const y = Math.floor(index / gridSize)

        const isSnakeHead = snake[0].x === x && snake[0].y === y
        const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y)
        const isFood = food.x === x && food.y === y

        let cellClass = 'snake-cell'
        let cellStyle = {
          backgroundColor: '#0f172a',
          borderRadius: '2px',
          transition: 'background-color 0.1s',
        }

        if (isSnakeHead) {
          cellClass += ' snake-head'
          cellStyle.backgroundColor = '#22c55e'
          cellStyle.boxShadow = '0 0 8px #22c55e'
          cellStyle.borderRadius = '4px'
        } else if (isSnakeBody) {
          cellClass += ' snake-body'
          cellStyle.backgroundColor = '#4ade80'
        } else if (isFood) {
          cellClass += ' snake-food'
          cellStyle.backgroundColor = '#ef4444'
          cellStyle.boxShadow = '0 0 8px #ef4444'
          cellStyle.borderRadius = '50%'
        }

        return (
          <div
            key={index}
            className={cellClass}
            style={cellStyle}
            aria-label={
              isSnakeHead ? 'Schlangenkopf' :
              isSnakeBody ? 'Schlangenkörper' :
              isFood ? 'Futter' : ''
            }
          />
        )
      })}
    </div>
  )
}
