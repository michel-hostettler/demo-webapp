import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodoList from './TodoList'
import { todoApi } from '../api/todoApi'

// Mock the todoApi
vi.mock('../api/todoApi', () => ({
  todoApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    toggle: vi.fn(),
    delete: vi.fn(),
    health: vi.fn()
  }
}))

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementations
    todoApi.getAll.mockResolvedValue([
      { id: 1, text: 'React lernen', completed: true },
      { id: 2, text: 'Dev Self-Service testen', completed: false }
    ])
    todoApi.health.mockResolvedValue({ status: 'ok' })
  })

  it('renders initial todos', async () => {
    render(<TodoList />)

    // Wait for async loading to complete
    expect(await screen.findByText('React lernen')).toBeInTheDocument()
    expect(screen.getByText('Dev Self-Service testen')).toBeInTheDocument()
  })

  it('adds a new todo', async () => {
    todoApi.create.mockResolvedValue({ id: 3, text: 'Neue Aufgabe', completed: false })

    render(<TodoList />)

    // Wait for initial load
    await screen.findByText('React lernen')

    const input = screen.getByTestId('todo-input')
    const addBtn = screen.getByTestId('add-todo')

    fireEvent.change(input, { target: { value: 'Neue Aufgabe' } })
    fireEvent.click(addBtn)

    expect(await screen.findByText('Neue Aufgabe')).toBeInTheDocument()
  })

  it('does not add empty todo', async () => {
    render(<TodoList />)

    // Wait for initial load
    await screen.findByText('React lernen')

    const initialCount = screen.getByTestId('todo-list').children.length

    fireEvent.change(screen.getByTestId('todo-input'), { target: { value: '   ' } })
    fireEvent.click(screen.getByTestId('add-todo'))

    // Wait a tick to ensure no async operation happened
    await waitFor(() => {
      expect(screen.getByTestId('todo-list').children.length).toBe(initialCount)
    })
  })
})
