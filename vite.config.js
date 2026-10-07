import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' perquè el build funcioni a qualsevol hosting (GitHub Pages, Netlify...)
export default defineConfig({
  plugins: [react()],
  base: './',
})
