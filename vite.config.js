import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/car-cost-calculator/',
  plugins: [react()],
})
