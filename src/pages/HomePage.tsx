import { useState } from "react";
import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { useGame } from "../hooks/useGame";
import { useCompareStore } from "../stores/useCompareStore";

// label ใช้แสดงบนหน้า ส่วน value เป็น slug ส่งให้ RAWG; ค่าว่างหมายถึงไม่กรองแนวเกม
const genres = [
  { label: "All Games", value: "" },
  { label: "Action", value: "action" },
  { label: "Adventure", value: "adventure" },
  { label: "Arcade", value: "arcade" },
  { label: "Board Games", value: "board-games" },
  { label: "Card", value: "card" },
  { label: "Casual", value: "casual" },
  { label: "Educational", value: "educational" },
  { label: "Family", value: "family" },
  { label: "Fighting", value: "fighting" },
  { label: "Indie", value: "indie" },
  { label: "Massively Multiplayer", value: "massively-multiplayer" },
  { label: "Platformer", value: "platformer" },
  { label: "Puzzle", value: "puzzle" },
  { label: "Racing", value: "racing" },
  { label: "RPG", value: "role-playing-games-rpg" },
  { label: "Shooter", value: "shooter" },
  { label: "Simulation", value: "simulation" },
  { label: "Sports", value: "sports" },
  { label: "Strategy", value: "strategy" },
];

export default function HomePage() {
  // selector อ่านเฉพาะ state/action ที่ต้องใช้จาก store กลาง รายการเกมเต็มไม่ได้เก็บที่นี่
  const compareIds = useCompareStore((state) => state.compareIds);
  const addCompare = useCompareStore((state) => state.addCompare);
  const removeCompare = useCompareStore((state) => state.removeCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  // แยกข้อความที่กำลังพิมพ์จากคำค้นที่ submit เพื่อไม่เรียก API ทุกตัวอักษร
  // state ของหน้านี้เริ่มใหม่เมื่อออกจากหน้าแล้วกลับมา ส่วน Query cache อาจยังอยู่
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // useGame ใช้คำค้นและแนวเกมเป็น key เพื่อแยกแคช; ระหว่างยังไม่มี data ใช้ array ว่าง
  const { data, isPending, isError, error, refetch, isFetching } = useGame(
    search,
    selectedGenre,
  );
  const games = data?.results ?? [];

  return (
    <>
      <PageHeader title="Discover Games" path="/" step="01" />

      <section aria-label="ค้นหาและกรองเกม" className="mb-5 space-y-3">
        <form
          role="search"
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            // หยุด form ไม่ให้ reload หน้า แล้วส่งคำค้นใหม่ผ่าน state ให้ Query ทำงาน
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
        <div className="w-full sm:max-w-xs">
          <label
            htmlFor="genre-filter"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            แนวเกม
          </label>

          {/* controlled select: value มาจาก state และ onChange เปลี่ยนทั้งตัวเลือกกับผลค้นหา */}
          <select
            id="genre-filter"
            name="genre"
            className="select h-11 w-full border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-500"
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* แถบเลือกติดขอบบนขณะเลื่อน เพื่อให้ไป Compare หรือล้างรายการได้สะดวก */}
      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-blue-200 bg-white p-3 shadow-sm">
        <p role="status" className="mr-auto text-sm text-blue-700">
          เลือกเปรียบเทียบ {compareIds.length}/2 เกม
        </p>
        {compareIds.length > 0 && (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={clearCompare}
            >
              ล้างที่เลือก
            </button>
            <Link className="btn btn-primary btn-sm" to="/compare">
              {compareIds.length === 2 ? "เปรียบเทียบเลย →" : "ดูเกมที่เลือก →"}
            </Link>
          </>
        )}
      </div>

      {/* เรียงสถานะโหลด → ผิดพลาด/ลองใหม่ → ไม่พบข้อมูล → รายการเกม */}
      {isPending ? (
        <div role="status">
          <span className="sr-only">กำลังโหลดรายการเกม...</span>

          <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <div className="skeleton h-32 w-full rounded-none sm:h-36" />

                <div className="space-y-3 p-4">
                  <div className="skeleton h-5 w-2/3" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
              {/* ครบสองเกมแล้วปิดการเพิ่มเกมอื่น แต่ยังเปิดปุ่มเกมเดิมไว้ให้นำออกได้ */}
              <div className="px-4 pb-4">
                <button
                  type="button"
                  aria-pressed={compareIds.includes(game.id)}
                  aria-label={`${compareIds.includes(game.id) ? "นำออกจากการเปรียบเทียบ" : "เลือกเปรียบเทียบ"} ${game.name}`}
                  disabled={
                    compareIds.length >= 2 && !compareIds.includes(game.id)
                  }
                  className={
                    compareIds.includes(game.id)
                      ? "btn btn-primary btn-sm w-full"
                      : "btn btn-outline btn-sm w-full border-blue-500 text-blue-600"
                  }
                  onClick={() => {
                    // ปุ่มเดียวสลับเพิ่ม/ลบโดยดู state ปัจจุบัน; store ตรวจจำนวนและการซ้ำอีกชั้น
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
