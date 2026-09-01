import { defineConfig } from 'vite'
export default defineConfig({
  logLevel: 'error',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: { outDir: '.sizeout/echarts', emptyOutDir: true, minify: 'esbuild', target: 'es2018',
    lib: { entry: '.sizeprobe/echarts.js', formats: ['es'], fileName: 'echarts' } }
})
