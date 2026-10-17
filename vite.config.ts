import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Vite ใช้ config นี้ทั้ง dev และ build: React plugin รองรับ JSX/Fast Refresh และ Tailwind แปลง CSS
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
