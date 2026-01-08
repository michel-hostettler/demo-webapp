import React from 'react'

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

export default function Tile({ value }) {
  const { bg, text } = getTileColor(value)

  return (
    <div
      style={{
        width: '65px',
        height: '65px',
        backgroundColor: bg,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: value >= 1000 ? '18px' : value >= 100 ? '22px' : '28px',
        fontWeight: 'bold',
        color: text,
        transition: 'all 0.15s ease-in-out',
        boxShadow: value > 0 ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
      }}
      data-testid={`tile-${value}`}
    >
      {value > 0 ? value : ''}
    </div>
  )
}
