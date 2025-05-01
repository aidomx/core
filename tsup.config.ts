import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2017',
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  shims: true,
  external: ['experimental'],
})
