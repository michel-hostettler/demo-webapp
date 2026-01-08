import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'

const TILE_SIZE = 65
const GAP_SIZE = 8
const SLIDE_DURATION = 150
const MERGE_DURATION = 200

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

  // Calculate target position
  const targetX = col * (TILE_SIZE + GAP_SIZE)
  const targetY = row * (TILE_SIZE + GAP_SIZE)

  // Calculate start position (previous position for sliding, or target if no movement)
  const startX = previousCol !== null ? previousCol * (TILE_SIZE + GAP_SIZE) : targetX
  const startY = previousRow !== null ? previousRow * (TILE_SIZE + GAP_SIZE) : targetY

  // Determine if tile needs to slide
  const needsSlide = previousRow !== null || previousCol !== null

  // Track current animated position
  const [currentPos, setCurrentPos] = useState({ x: startX, y: startY })
  const [isSliding, setIsSliding] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(
    isNew ? 'appearing' : isMerged ? 'merging' : needsSlide ? 'sliding' : 'idle'
  )

  const hasAnimatedRef = useRef(false)

  // Start at previous position, then animate to new position
  useLayoutEffect(() => {
    if (needsSlide && !hasAnimatedRef.current) {
      // Start at previous position immediately
      setCurrentPos({ x: startX, y: startY })
      setIsSliding(false)
      hasAnimatedRef.current = true

      // Trigger slide to new position after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSliding(true)
          setCurrentPos({ x: targetX, y: targetY })

          // After slide completes, check for merge animation
          setTimeout(() => {
            setIsSliding(false)
            if (isMerged) {
              setAnimationPhase('merging')
              setTimeout(() => setAnimationPhase('idle'), MERGE_DURATION)
            } else {
              setAnimationPhase('idle')
            }
          }, SLIDE_DURATION)
        })
      })
    } else if (isNew) {
      setCurrentPos({ x: targetX, y: targetY })
      setAnimationPhase('appearing')
      setTimeout(() => setAnimationPhase('idle'), SLIDE_DURATION)
    } else if (!needsSlide) {
      setCurrentPos({ x: targetX, y: targetY })
    }
  }, [needsSlide, startX, startY, targetX, targetY, isNew, isMerged])

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
      transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
      transition: isSliding ? `transform ${SLIDE_DURATION}ms ease-out` : 'none',
    }

    switch (animationPhase) {
      case 'appearing':
        return {
          ...baseStyle,
          animation: `popIn ${SLIDE_DURATION}ms ease-out forwards`,
        }
      case 'merging':
        return {
          ...baseStyle,
          animation: `merge ${MERGE_DURATION}ms ease-out forwards`,
          boxShadow: `0 0 20px ${getGlowColor(value)}, 0 2px 8px rgba(0,0,0,0.3)`,
        }
      default:
        return baseStyle
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes popIn {
            0% {
              transform: translate(${targetX}px, ${targetY}px) scale(0);
              opacity: 0;
            }
            50% {
              transform: translate(${targetX}px, ${targetY}px) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate(${targetX}px, ${targetY}px) scale(1);
              opacity: 1;
            }
          }

          @keyframes merge {
            0% {
              transform: translate(${currentPos.x}px, ${currentPos.y}px) scale(1);
            }
            50% {
              transform: translate(${currentPos.x}px, ${currentPos.y}px) scale(1.2);
            }
            100% {
              transform: translate(${currentPos.x}px, ${currentPos.y}px) scale(1);
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
