import React from 'react'
import Header from './components/Header'
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import Snake from './components/Snake'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Counter />
        <Snake />
        <TodoList />
      </main>
      <Footer />
    </div>
  )
}
