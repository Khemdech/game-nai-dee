import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import FavoriteGameItem from '../components/FavoriteGameItem'
import { useFavoritesStore } from '../stores/useFavoriteStore'

export default function FavoritesPage() {
  // อ่าน IDs ที่ persist ไว้; หน้านี้ไม่เรียก API รายการทั้งหมดซ้ำเพื่อหาเกมโปรด
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)

  return (
    <>
      <PageHeader
        title="My Collection"
        path="/favorites"
        description={`บันทึกเกมไว้ทั้งหมด ${favoriteIds.length} เกม`}
        step="03"
      />

      {/* ไม่มี ID ให้แสดงข้อความเริ่มต้น ถ้ามีจึงสร้าง component รายเกมเพื่อโหลดรายละเอียด */}
      {favoriteIds.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">ยังไม่มีเกมในรายการโปรด</p>
          <Link
            className="btn btn-primary btn-sm mt-4"
            to="/"
          >
            Discover games
          </Link>
        </div>
      ) : (
        <section className="space-y-3" aria-label="รายการเกมโปรด">
          {/* key ใช้ ID ที่คงที่ เพื่อให้ React จับคู่รายการได้เมื่อเพิ่มหรือลบ */}
          {favoriteIds.map((id) => (
            <FavoriteGameItem key={id} id={id} />
          ))}
        </section>
      )}
    </>
  )
}