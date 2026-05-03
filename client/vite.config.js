import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const previewPort = Number(process.env.PORT) || 4173

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    port: previewPort
  }
})
