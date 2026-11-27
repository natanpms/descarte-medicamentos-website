import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: repo name so `npm run build` output works on GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
