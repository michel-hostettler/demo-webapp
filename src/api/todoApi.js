// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * Todo API Client
 * Connects to the Spring Boot backend
 */
export const todoApi = {
  /**
   * Get all todos from backend
   */
  async getAll() {
    const response = await fetch(`${API_URL}/api/todos`)
    if (!response.ok) throw new Error('Failed to fetch todos')
    return response.json()
  },

  /**
   * Create a new todo
   */
  async create(text) {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    if (!response.ok) throw new Error('Failed to create todo')
    return response.json()
  },

  /**
   * Toggle todo completed status
   */
  async toggle(id) {
    const response = await fetch(`${API_URL}/api/todos/${id}/toggle`, {
      method: 'PATCH'
    })
    if (!response.ok) throw new Error('Failed to toggle todo')
    return response.json()
  },

  /**
   * Delete a todo
   */
  async delete(id) {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete todo')
  },

  /**
   * Get statistics
   */
  async getStats() {
    const response = await fetch(`${API_URL}/api/todos/stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },

  /**
   * Health check
   */
  async health() {
    const response = await fetch(`${API_URL}/api/health`)
    if (!response.ok) throw new Error('Backend not available')
    return response.json()
  }
}

export default todoApi
