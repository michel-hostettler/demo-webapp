import { useState, useCallback, useEffect } from 'react'

const SYMBOLS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎸', '🎺']

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const createCards = () => {
  const pairs = [...SYMBOLS, ...SYMBOLS]
  const shuffled = shuffleArray(pairs)
  return shuffled.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }))
}

export function useMemoryGame() {
  const [cards, setCards] = useState(createCards)
  const [flippedIndices, setFlippedIndices] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryBestScore')
    return saved ? parseInt(saved, 10) : null
  })

  const isGameWon = matches === SYMBOLS.length

  useEffect(() => {
    if (isGameWon && (bestScore === null || moves < bestScore)) {
      setBestScore(moves)
      localStorage.setItem('memoryBestScore', moves.toString())
    }
  }, [isGameWon, moves, bestScore])

  const handleCardClick = useCallback((index) => {
    if (isLocked) return
    if (cards[index].isFlipped || cards[index].isMatched) return
    if (flippedIndices.includes(index)) return

    // Flip the card
    setCards(prev => prev.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ))

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    // If two cards are flipped, check for match
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setIsLocked(true)

      const [first, second] = newFlipped
      const firstCard = cards[first]
      const secondCard = cards[second]

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, i) =>
            i === first || i === second
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(m => m + 1)
          setFlippedIndices([])
          setIsLocked(false)
        }, 500)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map((card, i) =>
            i === first || i === second
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedIndices([])
          setIsLocked(false)
        }, 1000)
      }
    }
  }, [cards, flippedIndices, isLocked])

  const resetGame = useCallback(() => {
    setCards(createCards())
    setFlippedIndices([])
    setMoves(0)
    setMatches(0)
    setIsLocked(false)
  }, [])

  return {
    cards,
    moves,
    matches,
    bestScore,
    isGameWon,
    handleCardClick,
    resetGame,
  }
}
