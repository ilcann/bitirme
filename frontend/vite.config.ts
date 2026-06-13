import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/ilcan21/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - büyük kütüphaneleri ayır
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'animation': ['framer-motion'],
          'i18n': ['react-i18next', 'i18next'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
