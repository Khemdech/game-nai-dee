import { Link, useParams } from "react-router";
import PageHeader from "../components/PageHeader";
import { useGameDetail } from "../hooks/useGameDetail";
import { useFavoritesStore } from "../stores/useFavoriteStore";
import { useCompareStore } from "../stores/useCompareStore";

export default function GameDetailPage() {
  const { id } = useParams<"id">();

  const isValidId =
    id !== undefined &&
    /^[1-9]\d*$/.test(id) &&
    Number.isSafeInteger(Number(id));

  const gameId = isValidId ? Number(id) : undefined;

  const isFavorite = useFavoritesStore(
    (state) => gameId !== undefined && state.favoriteIds.includes(gameId!),
  );

  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const compareIds = useCompareStore((state) => state.compareIds);
  const addCompare = useCompareStore((state) => state.addCompare);
  const removeCompare = useCompareStore((state) => state.removeCompare);

  const isInCompare = gameId !== undefined && compareIds.includes(gameId);

  const isCompareFull = compareIds.length >= 2;

  const {
    data: game,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGameDetail(gameId);

  return (
    <>
      <Link
        className="mb-4 inline-flex text-sm text-blue-600 hover:underline"
        to="/"
      >
        ← Back to Discover
      </Link>

      <PageHeader title="Game Details" path={`/games/${id ?? ""}`} step="02" />

      {!isValidId ? (
        <p role="alert" className="rounded-lg bg-red-50 p-5 text-red-700">
          รหัสเกมไม่ถูกต้อง ต้องเป็นจำนวนเต็มบวก
        </p>
      ) : isPending ? (
        <p role="status" className="py-10 text-center text-slate-500">
          กำลังโหลดรายละเอียดเกม...
        </p>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-5"
        >
          <p className="text-red-700">{error.message}</p>
          <button
            type="button"
            className="btn btn-primary btn-sm mt-3"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            {isFetching ? "กำลังลองใหม่..." : "ลองใหม่"}
          </button>
        </div>
      ) : game === null ? (
        <p role="status" className="py-10 text-center text-slate-500">
          ไม่พบเกมนี้ในฐานข้อมูล
        </p>
      ) : (
        <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {game.background_image ? (
            <img
              src={game.background_image}
              alt=""
              className="h-48 w-full object-cover sm:h-72"
            />
          ) : (
            <div className="grid h-48 place-items-center bg-blue-100 text-blue-700">
              ไม่มีรูปภาพ
            </div>
          )}

          <div className="space-y-4 p-5 sm:p-6">
            <h2 className="text-2xl font-bold">{game.name}</h2>

            <p className="text-sm text-blue-600">
              {game.genres.map((genre) => genre.name).join(", ") ||
                "ไม่ระบุประเภท"}
            </p>

            <p className="text-sm text-slate-700">
              ★ RAWG Rating: {game.rating.toFixed(1)}
              {" · "}
              Metacritic: {game.metacritic ?? "ไม่มีคะแนน"}
            </p>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium">Released</dt>
                <dd className="mt-1 text-slate-500">
                  {game.released ?? "ไม่ระบุวันวางจำหน่าย"}
                </dd>
              </div>

              <div>
                <dt className="font-medium">Platforms</dt>
                <dd className="mt-1 text-slate-500">
                  {game.platforms
                    ?.map((item) => item.platform.name)
                    .join(", ") || "ไม่ระบุแพลตฟอร์ม"}
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {game.description_raw.trim() || "ไม่มีคำอธิบายเกม"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                aria-pressed={isFavorite}
                className={
                  isFavorite
                    ? "btn btn-outline btn-sm border-blue-600 text-blue-600"
                    : "btn btn-primary btn-sm"
                }
                onClick={() => {
                  if (isFavorite) {
                    removeFavorite(game.id);
                  } else {
                    addFavorite(game.id);
                  }
                }}
              >
                {isFavorite ? "♥ Remove from Favorite" : "♥ Add to Favorite"}
              </button>
              <button
                type="button"
                aria-pressed={isInCompare}
                className={
                  isInCompare
                    ? "btn btn-primary btn-sm"
                    : "btn btn-outline btn-sm border-blue-600 text-blue-600"
                }
                disabled={!isInCompare && isCompareFull}
                onClick={() => {
                  if (isInCompare) {
                    removeCompare(game.id);
                  } else {
                    addCompare(game.id);
                  }
                }}
              >
                {isInCompare
                  ? "− Remove from Compare"
                  : isCompareFull
                    ? "เลือกครบ 2 เกมแล้ว"
                    : "＋ Add to Compare"}
              </button>
            </div>
            <p role="status" className="text-xs text-slate-500">
              เลือกไว้เปรียบเทียบ {compareIds.length}/2 เกม
              {isCompareFull && " —  you can remove a game from compare to add a new one."}
            </p>
          </div>
        </article>
      )}
    </>
  );
}
