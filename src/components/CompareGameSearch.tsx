import { useId, useState } from 'react'
import { useGameSearch } from '../hooks/useGameSearch'

// รับรายการ ID ที่เลือกและ callback ส่ง ID กลับให้ page ตัดสินใจเพิ่มหรือเปลี่ยนเกม
interface CompareGameSearchProps {
  label: string
  selectedIds: number[]
  onSelect: (id: number) => void
}

export default function CompareGameSearch({
  label,
  selectedIds,
  onSelect,
}: CompareGameSearchProps) {
  // สร้าง ID สำหรับ label/input ที่ไม่ชนกัน เมื่อใช้ component นี้สองฝั่ง
  const inputId = useId()
  // แต่ละ instance มีข้อความค้นหาของตนเอง ช่องซ้ายกับขวาจึงไม่พิมพ์ทับกัน
  const [search, setSearch] = useState('')
  // Hook จัดการเวลาและ API; component นี้รับผิดชอบเลือกสถานะที่แสดงบนหน้าจอ
  const { query, canSearch, isDebouncing } = useGameSearch(search)
  // API ขอสูงสุด 20 เกม แต่แสดงเพียง 5 ผลแรกเพื่อลดความยาวรายการ
  const games = query.data?.results.slice(0, 5) ?? []

  return (
    <div className="mb-4 space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="พิมพ์ชื่อเกม..."
        className="input h-10 w-full min-w-0 border-slate-300 bg-white text-sm"
      />

      {/* ตรวจคำสั้นและ debounce ก่อนข้อมูล API เพื่อไม่ให้ผลคำค้นเก่าปรากฏเป็นคำตอบของคำใหม่ */}
      {!canSearch ? (
        <p className="text-xs text-slate-500">
          พิมพ์อย่างน้อย 2 ตัวอักษร
        </p>
      ) : isDebouncing || query.isPending ? (
        <p role="status" className="text-sm text-slate-500">
          กำลังค้นหา...
        </p>
      ) : query.isError ? (
        <div role="alert" className="space-y-2">
          <p className="text-sm text-red-700">
            {query.error.message}
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? 'กำลังลองใหม่...' : 'ลองใหม่'}
          </button>
        </div>
      ) : games.length === 0 ? (
        <p role="status" className="text-sm text-slate-500">
          ไม่พบเกม ลองค้นหาด้วยชื่ออื่น
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            แสดงสูงสุด 5 รายการ กดชื่อเกมเพื่อเลือก
          </p>

          <ul className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
            {games.map((game) => {
              // เช็ก ID ของทั้งสองฝั่ง เพื่อปิดปุ่มเกมที่เลือกไปแล้ว
              const isSelected = selectedIds.includes(game.id)

              return (
                <li
                  key={game.id}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <button
                    type="button"
                    disabled={isSelected}
                    onClick={() => {
                      // ส่ง ID ให้ parent ก่อน แล้วล้างข้อความค้นหาของช่องนี้ ไม่เก็บข้อมูลเกมใน store
                      onSelect(game.id)
                      setSearch('')
                    }}
                    className="w-full break-words p-3 text-left text-sm hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <span className="block font-medium">
                      {game.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs">เลือกเกมนี้ไว้แล้ว</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}