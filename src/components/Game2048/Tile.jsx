import React, { useEffect, useState } from 'react'

const TILE_SIZE = 65
const GAP_SIZE = 8
const ANIMATION_DURATION = 150

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
  const [animationState, setAnimationState] = useState(
    isNew ? 'appearing' : previousRow !== null || previousCol !== null ? 'moving' : 'idle'
  )

  // Calculate position
  const x = col * (TILE_SIZE + GAP_SIZE)
  const y = row * (TILE_SIZE + GAP_SIZE)

  // Calculate previous position for slide animation
  const prevX = previousCol !== null ? previousCol * (TILE_SIZE + GAP_SIZE) : x
  const prevY = previousRow !== null ? previousRow * (TILE_SIZE + GAP_SIZE) : y

  useEffect(() => {
    if (isNew) {
      setAnimationState('appearing')
      const timer = setTimeout(() => setAnimationState('idle'), ANIMATION_DURATION)
      return () => clearTimeout(timer)
    } else if (isMerged) {
      setAnimationState('merging')
      const timer = setTimeout(() => setAnimationState('idle'), 200)
      return () => clearTimeout(timer)
    } else if (previousRow !== null || previousCol !== null) {
      setAnimationState('moving')
      const timer = setTimeout(() => setAnimationState('idle'), ANIMATION_DURATION)
      return () => clearTimeout(timer)
    }
  }, [isNew, isMerged, previousRow, previousCol])

  // Animation styles
  const getAnimationStyle = () => {
    const baseStyle = {
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
      boxShadow: value > 0 ? `0 2px 8px rgba(0,0,0,0.3)` : 'none',
      zIndex: isMerged ? 20 : 10,
    }

    switch (animationState) {
      case 'appearing':
        return {
          ...baseStyle,
          transform: `translate(${x}px, ${y}px)`,
          animation: 'popIn 150ms ease-out forwards',
        }
      case 'merging':
        return {
          ...baseStyle,
          transform: `translate(${x}px, ${y}px)`,
          animation: 'merge 200ms ease-out forwards',
          boxShadow: `0 0 20px ${getGlowColor(value)}, 0 2px 8px rgba(0,0,0,0.3)`,
        }
      case 'moving':
        return {
          ...baseStyle,
          transform: `translate(${x}px, ${y}px)`,
          transition: `transform ${ANIMATION_DURATION}ms ease-out`,
        }
      default:
        return {
          ...baseStyle,
          transform: `translate(${x}px, ${y}px)`,
        }
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes popIn {
            0% {
              transform: translate(${x}px, ${y}px) scale(0);
              opacity: 0;
            }
            50% {
              transform: translate(${x}px, ${y}px) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate(${x}px, ${y}px) scale(1);
              opacity: 1;
            }
          }

          @keyframes merge {
            0% {
              transform: translate(${x}px, ${y}px) scale(1);
            }
            50% {
              transform: translate(${x}px, ${y}px) scale(1.2);
            }
            100% {
              transform: translate(${x}px, ${y}px) scale(1);
            }
          }
        `}
      </style>
      <div
        style={getAnimationStyle()}
        data-testid={`tile-${value}`}
      >
        {value > 0 ? value : ''}
      </div>
    </>
  )
}
