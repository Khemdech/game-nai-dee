import { NavLink, Outlet } from 'react-router'

// รวมข้อมูลเมนูไว้ที่เดียว แล้ว map สร้างลิงก์ ลดการเขียน JSX ซ้ำ
const navigation = [
  { to: '/', label: 'Discover' },
  { to: '/favorites', label: 'Collection' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
]

// Layout ของเว็บ: เมนูและ footer คงอยู่ ส่วนหน้าลูกเปลี่ยนผ่าน Outlet
function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      {/* ลิงก์นี้ให้ผู้ใช้คีย์บอร์ดข้ามเมนูไปเนื้อหาหลักได้ */}
      <a className="skip-link" href="#main-content">ข้ามไปเนื้อหา</a>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-bold tracking-tight" aria-label="Game-Nai-Dee หน้าแรก">
            <span className="grid size-7 place-items-center rounded-md bg-blue-600 text-sm font-extrabold text-white">G</span>
            <span>Game-Nai-Dee</span>
          </NavLink>

          <nav aria-label="เมนูหลัก" className="flex flex-wrap items-center gap-1 sm:gap-4">
            {/* NavLink ส่ง isActive เพื่อเน้นเมนูปัจจุบัน; end ให้จับเส้นทางตรงกับเมนู */}
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) => [
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-10">
        {/* Router เลือก page ที่ตรง URL มาแสดงตรงนี้ โดยไม่โหลดเอกสารใหม่ทั้งหน้า */}
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:px-6">
          <p>Game-Nai-Dee · CS319 Mini Project 2</p>
          <a href="https://rawg.io/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Powered by RAWG API</a>
        </div>
      </footer>
    </div>
  )
}

export default App
