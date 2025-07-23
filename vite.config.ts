import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/HIMS',
  css: {
    postcss: './postcss.config.js'
  }
})