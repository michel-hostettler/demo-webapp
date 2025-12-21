import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from './TodoList'

describe('TodoList', () => {
  it('renders initial todos', () => {
    render(<TodoList />)
    expect(screen.getByText('React lernen')).toBeInTheDocument()
    expect(screen.getByText('Dev Self-Service testen')).toBeInTheDocument()
  })

  it('adds a new todo', () => {
    render(<TodoList />)
    
    const input = screen.getByTestId('todo-input')
    const addBtn = screen.getByTestId('add-todo')
    
    fireEvent.change(input, { target: { value: 'Neue Aufgabe' } })
    fireEvent.click(addBtn)
    
    expect(screen.getByText('Neue Aufgabe')).toBeInTheDocument()
  })

  it('does not add empty todo', () => {
    render(<TodoList />)
    
    const initialCount = screen.getByTestId('todo-list').children.length
    
    fireEvent.change(screen.getByTestId('todo-input'), { target: { value: '   ' } })
    fireEvent.click(screen.getByTestId('add-todo'))
    
    expect(screen.getByTestId('todo-list').children.length).toBe(initialCount)
  })
})
