import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import path from 'path'

export default defineConfig({
  base: './',
  root: './src',
  publicDir: '../public', 
   resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@html': path.resolve(__dirname, 'src/html'),
      '@fonts': path.resolve(__dirname, 'src/fonts'),
    }
  },
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/html')
    }),
    {
      name: 'watch-handlebars',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.hbs')) {
          console.log('Handlebars template changed:', file)
          server.ws.send({ type: 'full-reload' })
        }
      }
    }
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    open: true
  }
})
