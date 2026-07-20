import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Servi sous https://sleepingroomer.github.io/newomas/ par GitHub Pages :
// les assets doivent être résolus depuis ce sous-chemin, pas depuis la racine.
export default defineConfig({
  base: '/newomas/',
  plugins: [react()],
})
