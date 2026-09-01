import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React 16 has no automatic JSX runtime — force the classic transform.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  server: { port: 5173 }
})
