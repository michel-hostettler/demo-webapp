import React, { useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React lernen', completed: true },
    { id: 2, text: 'Dev Self-Service testen', completed: false },
    { id: 3, text: 'Feature Request erstellen', completed: false }
  ])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo.trim(), completed: false }
    ])
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="card todo-list">
      <h2>✅ Todo Liste</h2>
      
      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Neue Aufgabe..."
          data-testid="todo-input"
        />
        <button type="submit" className="add-btn" data-testid="add-todo">
          Hinzufügen
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="empty-state">Keine Aufgaben vorhanden</div>
      ) : (
        <ul data-testid="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
