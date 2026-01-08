import React, { useEffect, useState } from 'react'

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

  // Track position as percentage of grid (0-3 -> multiply by calc values)
  const [animatedPos, setAnimatedPos] = useState({
    row: previousRow ?? row,
    col: previousCol ?? col,
  })

  useEffect(() => {
    if (animatedPos.row !== row || animatedPos.col !== col) {
      requestAnimationFrame(() => {
        setAnimatedPos({ row, col })
      })
    }
  }, [row, col, animatedPos.row, animatedPos.col])

  let animationClass = ''
  if (isNew) {
    animationClass = 'tile-new'
  } else if (isMerged) {
    animationClass = 'tile-merged'
  }

  const getFontSize = () => {
    if (value >= 1000) return 'clamp(14px, 4vw, 20px)'
    if (value >= 100) return 'clamp(18px, 5vw, 24px)'
    return 'clamp(22px, 6vw, 30px)'
  }

  return (
    <div
      className={`absolute flex items-center justify-center font-bold rounded-lg ${animationClass}`}
      style={{
        width: 'var(--tile-size)',
        height: 'var(--tile-size)',
        backgroundColor: bg,
        color: text,
        fontSize: getFontSize(),
        boxShadow: isMerged
          ? `0 0 20px ${getGlowColor(value)}, 0 2px 8px rgba(0,0,0,0.3)`
          : value > 0
            ? '0 2px 8px rgba(0,0,0,0.3)'
            : 'none',
        zIndex: isMerged ? 20 : 10,
        transform: `translate(
          calc(${animatedPos.col} * (var(--tile-size) + var(--gap-size))),
          calc(${animatedPos.row} * (var(--tile-size) + var(--gap-size)))
        )`,
        transition: `transform ${SLIDE_DURATION}ms ease-out`,
      }}
      data-testid={`tile-${value}`}
    >
      {value > 0 ? value : ''}
    </div>
  )
}
