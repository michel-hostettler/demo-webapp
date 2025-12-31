import React, { useState, useEffect } from 'react'
import { todoApi } from '../api/todoApi'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Load todos from backend on mount
  useEffect(() => {
    loadTodos()
    checkBackend()
  }, [])

  const checkBackend = async () => {
    try {
      await todoApi.health()
      setBackendStatus('connected')
    } catch {
      setBackendStatus('offline')
    }
  }

  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await todoApi.getAll()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError('Konnte Todos nicht laden. Backend erreichbar?')
      // Fallback to local data
      setTodos([
        { id: 1, text: 'React lernen', completed: true },
        { id: 2, text: 'Backend verbinden', completed: false },
        { id: 3, text: 'Feature Request erstellen', completed: false }
      ])
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    try {
      const created = await todoApi.create(newTodo.trim())
      setTodos([...todos, created])
      setNewTodo('')
      setError(null)
    } catch (err) {
      // Fallback to local
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), completed: false }
      ])
      setNewTodo('')
      setError('Offline-Modus: Todo lokal gespeichert')
    }
  }

  const toggleTodo = async (id) => {
    try {
      await todoApi.toggle(id)
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    } catch {
      // Fallback to local toggle
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch {
      // Fallback to local delete
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  return (
    <div className="card todo-list">
      <h2>✅ Todo Liste</h2>
      
      {/* Backend Status Indicator */}
      <div className={`backend-status ${backendStatus}`}>
        {backendStatus === 'checking' && '⏳ Backend prüfen...'}
        {backendStatus === 'connected' && '🟢 Backend verbunden'}
        {backendStatus === 'offline' && '🔴 Backend offline (Lokal-Modus)'}
      </div>

      {error && <div className="error-message">{error}</div>}
      
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

      {loading ? (
        <div className="loading">Laden...</div>
      ) : todos.length === 0 ? (
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
