import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work at the domain root and under GitLab Pages project paths.
  base: './',
  plugins: [react()],
})
