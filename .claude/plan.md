# Implementierungsplan: QA Bug Hunter Snake Game

## 1. Übersicht

Ein **Snake-Spiel mit QA/Bug-Thematik**, bei dem:
- Die **Schlange** ein "QA-Tester" ist (mit Lupe als Kopf-Symbol)
- Das **Futter** sind **Bugs** (Käfer/Bug-Icons) die "gefangen" werden müssen
- **Power-Ups** erscheinen als "Hotfixes" für temporäre Vorteile
- Der **Score** zeigt "Bugs gefunden" an
- **Game Over** = "Zu viele Bugs entkommen" oder Crash

### Thematische Elemente:
| Spiel-Element | QA-Thema | Visuell |
|---------------|----------|---------|
| Schlange | QA-Tester | 🔍 (Kopf) + grüne Segmente |
| Futter | Bug | 🐛 (Käfer-Emoji/Icon) |
| Power-Up | Hotfix | 🔧 (erscheint selten) |
| Wand-Crash | "App Crashed!" | 💥 |
| Score | "Bugs Squashed" | Counter |
| High-Score | "Best QA Session" | Persistiert |

---

## 2. Betroffene Dateien

### Neue Dateien erstellen:
| Datei | Zweck | Geschätzte Zeilen |
|-------|-------|-------------------|
| `src/components/games/SnakeGame.jsx` | Haupt-Spielkomponente | ~180 |
| `src/components/games/SnakeGame.css` | Spiel-spezifische Styles | ~120 |
| `src/components/games/SnakeGame.test.jsx` | Unit Tests | ~50 |
| `src/components/games/index.js` | Re-Export | ~3 |

### Bestehende Dateien ändern:
| Datei | Änderung |
|-------|----------|
| `src/App.jsx` | Import + Einbinden der SnakeGame-Komponente |
| `src/styles.css` | Minimale Ergänzungen für Game-Container |

---

## 3. Implementierungsschritte

### Schritt 1: Ordnerstruktur anlegen
```
src/components/games/
├── SnakeGame.jsx
├── SnakeGame.css
├── SnakeGame.test.jsx
└── index.js
```

### Schritt 2: SnakeGame.jsx Komponente

**Core Features:**
```jsx
// State Management
const [snake, setSnake] = useState([{x: 10, y: 10}])  // Schlangen-Segmente
const [bug, setBug] = useState({x: 5, y: 5})          // Bug-Position
const [direction, setDirection] = useState('RIGHT')   // Bewegungsrichtung
const [gameOver, setGameOver] = useState(false)       // Spielstatus
const [score, setScore] = useState(0)                 // Bugs gefunden
const [isPaused, setIsPaused] = useState(true)        // Pause-Status
const [speed, setSpeed] = useState(150)               // Geschwindigkeit (ms)
```

**Game Loop:**
- `useEffect` mit `setInterval` für Bewegung
- Keyboard Event Listener (WASD + Pfeiltasten)
- Collision Detection (Wand, Selbst, Bug)
- Score-Tracking

**UI Layout:**
```
┌─────────────────────────────────┐
│    🔍 BUG HUNTER SNAKE          │
│    Bugs Squashed: 12            │
├─────────────────────────────────┤
│                                 │
│     ┌─────────────────────┐     │
│     │    SPIELFELD        │     │
│     │   20x20 Grid        │     │
│     │   🔍●●● →    🐛     │     │
│     │                     │     │
│     └─────────────────────┘     │
│                                 │
│  [▶ Start]  [⏸ Pause]  [↻ Reset]│
│                                 │
│  Steuerung: WASD / Pfeiltasten  │
└─────────────────────────────────┘
```

### Schritt 3: SnakeGame.css Styles

**Design passend zum bestehenden Style:**
- Weisse Card mit Border-Radius 16px
- Purple/Blue Farbschema (#667eea)
- Grid-basiertes Spielfeld mit Schatten
- Animierte Schlangen-Segmente
- Hover-Effekte auf Buttons
- Responsive für Mobile (Touch-Controls optional)

**CSS-Variablen:**
```css
.snake-game {
  --grid-size: 20;
  --cell-size: 20px;
  --snake-color: #10B981;      /* Emerald für QA */
  --bug-color: #EF4444;        /* Rot für Bugs */
  --hotfix-color: #F59E0B;     /* Amber für Hotfix */
}
```

### Schritt 4: Spiellogik implementieren

**Bewegungs-Algorithmus:**
```javascript
const moveSnake = () => {
  const head = {...snake[0]}

  switch(direction) {
    case 'UP':    head.y -= 1; break
    case 'DOWN':  head.y += 1; break
    case 'LEFT':  head.x -= 1; break
    case 'RIGHT': head.x += 1; break
  }

  // Collision Check
  if (isWallCollision(head) || isSelfCollision(head)) {
    setGameOver(true)
    return
  }

  // Bug gefangen?
  if (head.x === bug.x && head.y === bug.y) {
    setScore(s => s + 1)
    spawnNewBug()
    // Schlange wächst (kein pop)
  } else {
    snake.pop() // Letztes Segment entfernen
  }

  setSnake([head, ...snake])
}
```

### Schritt 5: QA-Thematische Elemente

**Game Over Screen:**
```jsx
{gameOver && (
  <div className="game-over-overlay">
    <h3>💥 APP CRASHED!</h3>
    <p>Der QA-Tester ist auf einen kritischen Bug gestossen!</p>
    <p>Bugs squashed: {score}</p>
    <button onClick={resetGame}>🔄 Neuer Test-Run</button>
  </div>
)}
```

**Score-Anzeige:**
```jsx
<div className="score-board">
  <span className="score-label">🐛 Bugs Squashed:</span>
  <span className="score-value">{score}</span>
</div>
```

### Schritt 6: App.jsx Integration

```jsx
import SnakeGame from './components/games'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Counter />
        <TodoList />
        <SnakeGame />  {/* Neu */}
      </main>
      <Footer />
    </div>
  )
}
```

### Schritt 7: Unit Tests

**SnakeGame.test.jsx:**
```javascript
describe('SnakeGame', () => {
  test('renders game board', () => {...})
  test('starts game on button click', () => {...})
  test('increases score when bug is caught', () => {...})
  test('ends game on wall collision', () => {...})
  test('responds to keyboard input', () => {...})
})
```

### Schritt 8: Verification
- `npm test` ausführen
- `npm run build` prüfen
- Manueller Spieltest im Browser

---

## 4. Risiken & Abhängigkeiten

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Performance bei schneller Geschwindigkeit | Mittel | requestAnimationFrame statt setInterval falls nötig |
| Keyboard-Events im falschen Kontext | Niedrig | Focus-Management, Event-Cleanup in useEffect |
| Mobile Touch-Support | Mittel | Optional: Touch-Buttons hinzufügen |
| CSS-Konflikte mit bestehenden Styles | Niedrig | Scoped CSS mit `.snake-game` Prefix |
| Test-Komplexität mit Timern | Mittel | jest.useFakeTimers() verwenden |

**Abhängigkeiten:**
- Keine neuen npm-Pakete erforderlich
- Reine React + CSS Lösung
- Kompatibel mit bestehendem Vite/Vitest Setup

---

## 5. Testplan

### Automatisierte Tests:
- [ ] Komponente rendert ohne Fehler
- [ ] Start-Button initialisiert das Spiel
- [ ] Score erhöht sich bei Bug-Fang
- [ ] Game Over bei Wand-Kollision
- [ ] Reset-Button setzt Spiel zurück
- [ ] Tastatur-Steuerung funktioniert

### Manuelle Tests:
- [ ] Spiel startet und läuft flüssig
- [ ] Schlange bewegt sich in alle Richtungen
- [ ] Bugs erscheinen an zufälligen Positionen
- [ ] Schlange wächst beim Bug-Fangen
- [ ] Game Over Overlay erscheint korrekt
- [ ] Responsive auf verschiedenen Bildschirmgrössen
- [ ] Keine Console-Errors

### Build-Verification:
- [ ] `npm test` - alle Tests grün
- [ ] `npm run build` - keine Build-Fehler
- [ ] `npm run preview` - Spiel funktioniert im Production-Build

---

## 6. Geschätzter Umfang

| Komponente | Zeilen | Komplexität |
|------------|--------|-------------|
| SnakeGame.jsx | ~180 | Mittel |
| SnakeGame.css | ~120 | Niedrig |
| SnakeGame.test.jsx | ~50 | Niedrig |
| App.jsx Änderungen | ~3 | Trivial |
| **Total** | **~350** | **Mittel** |

Das Spiel bleibt unter den 200-Zeilen-Limits pro Datei gemäss CLAUDE.md.
