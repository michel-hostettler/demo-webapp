export default function GameStatus({ currentPlayer, winner, scores, onReset, onResetScores }) {
  const getStatusMessage = () => {
    if (winner === 'draw') {
      return 'Unentschieden!'
    }
    if (winner) {
      return `Spieler ${winner} gewinnt!`
    }
    return `Spieler ${currentPlayer} ist am Zug`
  }

  return (
    <div className="tictactoe-status">
      <div className={`status-message ${winner ? 'winner' : ''}`}>
        {getStatusMessage()}
      </div>

      <div className="tictactoe-scoreboard">
        <div className="score x">
          <span className="label">X</span>
          <span className="value">{scores.x}</span>
        </div>
        <div className="score draws">
          <span className="label">-</span>
          <span className="value">{scores.draws}</span>
        </div>
        <div className="score o">
          <span className="label">O</span>
          <span className="value">{scores.o}</span>
        </div>
      </div>

      <div className="tictactoe-buttons">
        <button className="reset-btn" onClick={onReset}>
          Neues Spiel
        </button>
        <button className="reset-scores-btn" onClick={onResetScores}>
          Punkte zurücksetzen
        </button>
      </div>
    </div>
  )
}
