import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import FavoriteGameItem from '../components/FavoriteGameItem'
import { useFavoritesStore } from '../stores/useFavoriteStore'

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)

  return (
    <>
      <PageHeader
        title="My Collection"
        path="/favorites"
        description={`บันทึกเกมไว้ทั้งหมด ${favoriteIds.length} เกม`}
        step="03"
      />

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
          {favoriteIds.map((id) => (
            <FavoriteGameItem key={id} id={id} />
          ))}
        </section>
      )}
    </>
  )
}