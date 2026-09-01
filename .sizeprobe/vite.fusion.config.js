import { defineConfig } from 'vite'
export default defineConfig({
  logLevel: 'error',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: { outDir: '.sizeout/fusion', emptyOutDir: true, minify: 'esbuild', target: 'es2018',
    lib: { entry: '.sizeprobe/fusion.js', formats: ['es'], fileName: 'fusion' } }
})
