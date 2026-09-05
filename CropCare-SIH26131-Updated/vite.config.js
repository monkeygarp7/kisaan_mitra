import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api/* to the FastAPI backend during development so the
    // browser never has to deal with cross-origin requests. This is a
    // frontend-only convenience layer - the backend itself is untouched.
    // Change the target if your teammate runs the backend on a
    // different host/port (e.g. via VITE_BACKEND_URL).
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
