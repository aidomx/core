import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  root: 'experimental',
  plugins: [
    tsconfigPaths({ projects: [path.resolve(__dirname, 'tsconfig.json')] }),
  ],
  test: {
    include: ['**/*.{test,spec}.{ts,js}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
