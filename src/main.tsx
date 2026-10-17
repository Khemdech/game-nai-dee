import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { router } from './router'
import './index.css'

// สร้าง QueryClient นอก component เพื่อให้เปลี่ยนหน้าแล้วใช้แคชชุดเดิมในแท็บนี้
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ข้อมูลถือว่าสด 5 นาที ไม่ใช่การตั้งเวลาเรียก API ทุก 5 นาที
      staleTime: 1000 * 60 * 5,
      // เมื่อคำขอล้มเหลว ให้ลองเพิ่มอีก 1 ครั้งก่อนแสดง error
      retry: 1,
    },
  },
})

// หา DOM ที่ React จะวาดหน้าเว็บลงไป ถ้าไม่มีให้แจ้งข้อผิดพลาดชัดเจน
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('ไม่พบ element #root ใน index.html')
}

// StrictMode ช่วยตรวจปัญหาใน dev; Provider ให้ทุกหน้าใช้ QueryClient และ router ร่วมกัน
// แคชนี้อยู่ในหน่วยความจำ จึงเริ่มใหม่เมื่อ F5 ไม่ใช่ localStorage
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)