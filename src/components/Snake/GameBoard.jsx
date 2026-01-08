import React from 'react'

export default function GameBoard({ snake, food, gridSize }) {
  return (
    <div
      className="grid bg-slate-800 rounded-xl p-1 border-2 border-slate-700 w-full aspect-square"
      role="img"
      aria-label="Snake Spielfeld"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '1px',
        maxWidth: 'min(100%, 350px)',
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize
        const y = Math.floor(index / gridSize)

        const isSnakeHead = snake[0].x === x && snake[0].y === y
        const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y)
        const isFood = food.x === x && food.y === y

        let className = 'transition-colors duration-100 '
        let style = {}

        if (isSnakeHead) {
          className += 'bg-green-500 rounded'
          style.boxShadow = '0 0 8px #22c55e'
        } else if (isSnakeBody) {
          className += 'bg-green-400 rounded-sm'
        } else if (isFood) {
          className += 'bg-red-500 rounded-full'
          style.boxShadow = '0 0 8px #ef4444'
        } else {
          className += 'bg-slate-900 rounded-sm'
        }

        return (
          <div
            key={index}
            className={className}
            style={style}
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
