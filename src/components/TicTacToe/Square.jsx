export default function Square({ value, onClick, isWinning, disabled }) {
  const getClassName = () => {
    let className = 'tictactoe-square'
    if (value) className += ` ${value.toLowerCase()}`
    if (isWinning) className += ' winning'
    if (!value && !disabled) className += ' available'
    return className
  }

  return (
    <button
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Feld mit ${value}` : 'Leeres Feld'}
    >
      {value}
    </button>
  )
}
