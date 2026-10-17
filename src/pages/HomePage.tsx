import { useState } from "react";
import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { useGame } from "../hooks/useGame";
import { useCompareStore } from "../stores/useCompareStore";

const genres = [
  { label: "All Games", value: "" },
  { label: "Action", value: "action" },
  { label: "RPG", value: "role-playing-games-rpg" },
  { label: "Adventure", value: "adventure" },
];

export default function HomePage() {
  const compareIds = useCompareStore((state) => state.compareIds);
  const addCompare = useCompareStore((state) => state.addCompare);
  const removeCompare = useCompareStore((state) => state.removeCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const { data, isPending, isError, error, refetch, isFetching } =
    useGame(search, selectedGenre);
  const games = data?.results ?? [];

  return (
    <>
      <PageHeader title="Discover Games" path="/" step="01" />

      <section aria-label="ค้นหาและกรองเกม" className="mb-5 space-y-3">
        <form
          role="search"
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
          }}
        >
          <label className="sr-only" htmlFor="game-search">
            Search games by title
          </label>
          <input
            id="game-search"
            name="search"
            className="input input-bordered h-11 w-full min-w-0 border-slate-300 bg-white text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Search games by title..."
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <button
            type="submit"
            className="btn h-11 shrink-0 border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2" aria-label="ตัวกรองประเภทเกม">
          {genres.map((genre) => (
            <button
              key={genre.value}
              type="button"
              className={
                selectedGenre === genre.value
                  ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              }
              onClick={() => setSelectedGenre(genre.value)}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </section>

      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-blue-200 bg-white p-3 shadow-sm">
        <p role="status" className="mr-auto text-sm text-blue-700">
          เลือกเปรียบเทียบ {compareIds.length}/2 เกม
        </p>
        {compareIds.length > 0 && (
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearCompare}>
              ล้างที่เลือก
            </button>
            <Link className="btn btn-primary btn-sm" to="/compare">
              {compareIds.length === 2 ? "เปรียบเทียบเลย →" : "ดูเกมที่เลือก →"}
            </Link>
          </>
        )}
      </div>

      {isPending ? (
        <p role="status" className="py-10 text-center text-slate-500">
          กำลังโหลดรายการเกม...
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
      ) : games.length === 0 ? (
        <p role="status" className="py-10 text-center text-slate-500">
          ไม่พบรายการเกม
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2" aria-label="รายการเกม">
          {games.map((game) => (
            <article
              key={game.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              {game.background_image ? (
                <img
                  src={game.background_image}
                  alt=""
                  loading="lazy"
                  className="h-32 w-full object-cover sm:h-36"
                />
              ) : (
                <div className="grid h-32 place-items-center bg-blue-100 text-blue-700 sm:h-36">
                  ไม่มีรูปภาพ
                </div>
              )}

              <div className="flex flex-1 items-end justify-between gap-3 p-4">
                <div className="min-w-0 break-words">
                  <h2 className="font-semibold">{game.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {game.genres.map((genre) => genre.name).join(", ") ||
                      "ไม่ระบุประเภท"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-amber-600">
                    ★ {game.rating.toFixed(1)}
                  </p>
                  <Link
                    className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
                    to={`/games/${game.id}`}
                  >
                    View details
                  </Link>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  type="button"
                  aria-pressed={compareIds.includes(game.id)}
                  aria-label={`${compareIds.includes(game.id) ? "นำออกจากการเปรียบเทียบ" : "เลือกเปรียบเทียบ"} ${game.name}`}
                  disabled={compareIds.length >= 2 && !compareIds.includes(game.id)}
                  className={compareIds.includes(game.id)
                    ? "btn btn-primary btn-sm w-full"
                    : "btn btn-outline btn-sm w-full border-blue-500 text-blue-600"}
                  onClick={() => {
                    if (compareIds.includes(game.id)) {
                      removeCompare(game.id);
                    } else {
                      addCompare(game.id);
                    }
                  }}
                >
                  {compareIds.includes(game.id)
                    ? "✓ เลือกแล้ว · กดเพื่อนำออก"
                    : compareIds.length >= 2
                      ? "เลือกครบ 2 เกมแล้ว"
                      : "＋ เลือกเปรียบเทียบ"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
