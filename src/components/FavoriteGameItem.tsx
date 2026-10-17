import { Link } from 'react-router'
import { useFavoritesStore } from '../stores/useFavoriteStore'
import { useGameDetail } from '../hooks/useGameDetail'

interface FavoriteGameItemProps {
    id: number
}

export default function FavoriteGameItem({ id }: FavoriteGameItemProps) {
    const { data: game, isPending, isError, error, refetch, isFetching } = useGameDetail(id)

    const removeFavorite = useFavoritesStore((state) => state.removeFavorite)

      return (
    <article className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        {isPending ? (
          <p role="status" className="text-sm text-slate-500">
            กำลังโหลดเกม #{id}...
          </p>
        ) : isError ? (
          <div role="alert">
            <p className="text-sm text-red-700">{error.message}</p>
            <button
              type="button"
              className="btn btn-outline btn-sm mt-2"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'กำลังลองใหม่...' : 'ลองใหม่'}
            </button>
          </div>
        ) : game === null ? (
          <p className="text-sm text-slate-500">
            ไม่พบเกม #{id} ในฐานข้อมูลแล้ว
          </p>
        ) : (
          <div className="flex items-center gap-4">
            {game.background_image ? (
              <img
                src={game.background_image}
                alt=""
                loading="lazy"
                className="size-20 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="grid size-20 shrink-0 place-items-center rounded-md bg-blue-100 text-xs text-blue-700">
                ไม่มีรูป
              </div>
            )}

            <div className="min-w-0">
              <h2 className="break-words font-semibold">{game.name}</h2>
              <p className="mt-1 text-xs text-slate-500">
                ★ {game.rating.toFixed(1)}
              </p>
              <Link
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                to={`/games/${game.id}`}
              >
                View details
              </Link>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn btn-outline btn-sm border-blue-500 text-blue-600"
        aria-label={`นำเกม ${game?.name ?? `#${id}`} ออกจากรายการโปรด`}
        onClick={() => removeFavorite(id)}
      >
        Remove
      </button>
    </article>
  )
}