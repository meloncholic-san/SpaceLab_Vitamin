import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import path from 'path'
import fs from 'fs'

function getHtmlEntries(dir) {
  const entries = {}

  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      entries[name] = path.resolve(dir, file)
    }
  })

  return entries
}

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
          server.ws.send({ type: 'full-reload' })
        }
      }
    }
  ],

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries(path.resolve(__dirname, 'src'))
    }
  },

  server: {
    open: true
  }
})
