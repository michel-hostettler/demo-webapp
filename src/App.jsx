import React, { useState } from 'react'
import Header from './components/Header'
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import Snake from './components/Snake'
import Game2048 from './components/Game2048'
import GameSelector from './components/GameSelector'
import Footer from './components/Footer'

export default function App() {
  const [selectedGame, setSelectedGame] = useState('snake')

  const renderGame = () => {
    switch (selectedGame) {
      case 'snake':
        return <Snake />
      case '2048':
        return <Game2048 />
      default:
        return <Snake />
    }
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Counter />
        <section className="games-section" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <GameSelector
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame}
          />
          {renderGame()}
        </section>
        <TodoList />
      </main>
      <Footer />
    </div>
  )
}
