
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json'],
      exclude: [
        '**/*.stories.tsx',
        '**/node_modules/**',
        '**/dist/**',
        '**/test/**',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/coverage/**'
      ]
    }
  }
})

