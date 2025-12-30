import React from 'react'
import Header from './components/Header'
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import { SnakeGame } from './components/games'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Counter />
        <TodoList />
        <SnakeGame />
      </main>
      <Footer />
    </div>
  )
}
