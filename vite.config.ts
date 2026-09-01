import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,ts}'],
    // layoutRadial's growth tests are genuinely slow — ~13s each.
    testTimeout: 30_000
  }
})
