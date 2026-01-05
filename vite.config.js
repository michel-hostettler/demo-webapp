import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    server: {
      deps: {
        inline: ['react', 'react-dom']
      }
    }
  },
  resolve: {
    conditions: ['development', 'browser']
  }
})
