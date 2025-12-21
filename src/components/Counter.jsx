import React, { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="card counter">
      <h2>📊 Counter</h2>
      <div className="count" data-testid="count">{count}</div>
      <div className="buttons">
        <button 
          className="decrement" 
          onClick={() => setCount(c => c - 1)}
          data-testid="decrement"
        >
          - 1
        </button>
        <button 
          className="reset" 
          onClick={() => setCount(0)}
          data-testid="reset"
        >
          Reset
        </button>
        <button 
          className="increment" 
          onClick={() => setCount(c => c + 1)}
          data-testid="increment"
        >
          + 1
        </button>
      </div>
    </div>
  )
}
