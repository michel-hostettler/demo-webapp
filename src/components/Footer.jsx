import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer>
      <p>© {year} Demo WebApp - Powered by Dev Self-Service</p>
    </footer>
  )
}
