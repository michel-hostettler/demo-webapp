import React, { useEffect, useState } from 'react'

const TILE_SIZE = 65
const GAP_SIZE = 8
const SLIDE_DURATION = 150

const getTileColor = (value) => {
  const colors = {
    0: { bg: '#1e293b', text: '#1e293b' },
    2: { bg: '#334155', text: '#f8fafc' },
    4: { bg: '#475569', text: '#f8fafc' },
    8: { bg: '#f97316', text: '#f8fafc' },
    16: { bg: '#ea580c', text: '#f8fafc' },
    32: { bg: '#ef4444', text: '#f8fafc' },
    64: { bg: '#dc2626', text: '#f8fafc' },
    128: { bg: '#eab308', text: '#f8fafc' },
    256: { bg: '#ca8a04', text: '#f8fafc' },
    512: { bg: '#a16207', text: '#f8fafc' },
    1024: { bg: '#854d0e', text: '#f8fafc' },
    2048: { bg: '#3b82f6', text: '#f8fafc' },
  }
  return colors[value] || { bg: '#3b82f6', text: '#f8fafc' }
}

const getGlowColor = (value) => {
  if (value >= 2048) return 'rgba(59, 130, 246, 0.6)'
  if (value >= 512) return 'rgba(161, 98, 7, 0.5)'
  if (value >= 128) return 'rgba(234, 179, 8, 0.5)'
  if (value >= 32) return 'rgba(239, 68, 68, 0.5)'
  if (value >= 8) return 'rgba(249, 115, 22, 0.5)'
  return 'transparent'
}

export default function Tile({ tile }) {
  const { value, row, col, previousRow, previousCol, isNew, isMerged } = tile
  const { bg, text } = getTileColor(value)

  // Use previous position for initial render, then animate to current position
  const [animatedPos, setAnimatedPos] = useState({
    x: (previousCol ?? col) * (TILE_SIZE + GAP_SIZE),
    y: (previousRow ?? row) * (TILE_SIZE + GAP_SIZE),
  })

  useEffect(() => {
    // If position changed, animate to new position
    const targetX = col * (TILE_SIZE + GAP_SIZE)
    const targetY = row * (TILE_SIZE + GAP_SIZE)

    if (animatedPos.x !== targetX || animatedPos.y !== targetY) {
      // Use requestAnimationFrame to ensure the transition happens
      requestAnimationFrame(() => {
        setAnimatedPos({ x: targetX, y: targetY })
      })
    }
  }, [row, col, animatedPos.x, animatedPos.y])

  // Determine animation class
  let animationClass = ''
  if (isNew) {
    animationClass = 'tile-new'
  } else if (isMerged) {
    animationClass = 'tile-merged'
  }

  const style = {
    position: 'absolute',
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    backgroundColor: bg,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: value >= 1000 ? '18px' : value >= 100 ? '22px' : '28px',
    fontWeight: 'bold',
    color: text,
    boxShadow: isMerged
      ? `0 0 20px ${getGlowColor(value)}, 0 2px 8px rgba(0,0,0,0.3)`
      : value > 0
        ? '0 2px 8px rgba(0,0,0,0.3)'
        : 'none',
    zIndex: isMerged ? 20 : 10,
    transform: `translate(${animatedPos.x}px, ${animatedPos.y}px)`,
    transition: `transform ${SLIDE_DURATION}ms ease-out`,
  }

  return (
    <div
      style={style}
      className={animationClass}
      data-testid={`tile-${value}`}
    >
      {value > 0 ? value : ''}
    </div>
  )
}
