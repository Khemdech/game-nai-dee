import { createBrowserRouter } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import GameDetailPage from './pages/GameDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import ComparePage from './pages/ComparePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import RouteErrorPage from './pages/RouteErrorPage'

// สร้าง router ครั้งเดียวนอก component; หน้าลูกแสดงผ่าน Outlet ใน App
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // หน้า fallback เมื่อเส้นทางเกิดข้อผิดพลาดระหว่าง render ต่างจาก API error ที่แต่ละหน้าจัดการเอง
    errorElement: <RouteErrorPage />,
    // หน้าลูกใช้ header/footer ของ App ร่วมกัน และแสดงเนื้อหาตรง Outlet
    children: [
      { index: true, element: <HomePage /> },
      // :id เป็นข้อความจาก URL; GameDetailPage ต้องตรวจและแปลงก่อนส่งไป API
      { path: 'games/:id', element: <GameDetailPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'about', element: <AboutPage /> },
      // รับ URL ที่ไม่ตรงกับหน้าใด ไม่ใช่กรณี API หาเกมไม่พบ
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
