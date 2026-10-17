import {Link} from 'react-router'
import PageHeader from '../components/PageHeader'
import { useCompareStore } from '../stores/useCompareStore'
import {useGameDetail} from '../hooks/useGameDetail'


export default function ComparePage() {
  const compareIds = useCompareStore((state) => state.compareIds)
  const removeCompare = useCompareStore((state) => state.removeCompare)
  const clearCompare = useCompareStore((state) => state.clearCompare)

  const firstQuery = useGameDetail(compareIds[0])
  const secondQuery = useGameDetail(compareIds[1])

  const firstGame = firstQuery.data
  const secondGame = secondQuery.data

  const slots = [
    {id: compareIds[0], query: firstQuery},
    {id: compareIds[1], query: secondQuery}
  ]

  const comparisonRows = firstGame && secondGame ? [ [
    'Genre',
    firstGame.genres.map((genre) => genre.name).join(', ') || 'ไม่ระบุ',
    secondGame.genres.map((genre) => genre.name).join(', ') || 'ไม่ระบุ'
  ],
  [
    'Released',
    firstGame.released ?? 'ไม่ระบุ',
    secondGame.released ?? 'ไม่ระบุ'
  ],[
    'RAWG Rating',
    firstGame.rating.toFixed(1),
    secondGame.rating.toFixed(1)
  ],[
    'Metacritic',
    String(firstGame.metacritic ?? 'ไม่ระบุ'),
    String(secondGame.metacritic ?? 'ไม่ระบุ')
  ],[
    'Platforms',
    firstGame.platforms?.map((item) => item.platform.name).join(', ') || 'ไม่ระบุ',
    secondGame.platforms?.map((item) => item.platform.name).join(', ') || 'ไม่ระบุ'
  ]] : []

  return (
    <>
      <PageHeader
        title="Compare Games"
        path="/compare"
        description={`เลือกแล้ว ${compareIds.length}/2 เกม`}
        step="04"
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          className="btn btn-outline btn-sm border-blue-500 text-blue-600"
          to="/"
        >
          เลือกเกมจาก Discover
        </Link>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={clearCompare}
          disabled={compareIds.length === 0}
        >
          Clear Compare
        </button>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {slots.map(({ id, query }, index) => (
          <section
            key={index}
            aria-label={`เกมที่ ${index + 1}`}
            className="min-w-0 break-words p-3 sm:p-4"
          >
            {id === undefined ? (
              <div className="grid min-h-48 place-items-center text-sm text-slate-500">
                เลือกเกมที่ {index + 1} จากหน้า Discover
              </div>
            ) : (
              <>
                {query.isPending ? (
                  <p role="status" className="py-10 text-slate-500">
                    กำลังโหลดเกม #{id}...
                  </p>
                ) : query.isError ? (
                  <div role="alert">
                    <p className="text-sm text-red-700">
                      {query.error.message}
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm mt-3"
                      onClick={() => void query.refetch()}
                      disabled={query.isFetching}
                    >
                      {query.isFetching ? 'กำลังลองใหม่...' : 'ลองใหม่'}
                    </button>
                  </div>
                ) : query.data === null ? (
                  <p className="py-10 text-sm text-slate-500">
                    ไม่พบเกม #{id} ในฐานข้อมูลแล้ว
                  </p>
                ) : (
                  <>
                    {query.data.background_image ? (
                      <img
                        src={query.data.background_image}
                        alt=""
                        className="h-40 w-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="grid h-40 place-items-center rounded-md bg-blue-100 text-blue-700">
                        ไม่มีรูปภาพ
                      </div>
                    )}

                    <h2 className="mt-3 font-semibold">
                      {query.data.name}
                    </h2>
                    <Link
                      className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                      to={`/games/${id}`}
                    >
                      View details
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-4 block h-auto min-h-8 max-w-full whitespace-normal py-1"
                  aria-label={`นำเกม ${query.data?.name ?? `#${id}`} ออกจากการเปรียบเทียบ`}
                  onClick={() => removeCompare(id)}
                >
                  นำเกมนี้ออก
                </button>
              </>
            )}
          </section>
        ))}
      </div>

      {firstGame && secondGame && (
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="sr-only">
              เปรียบเทียบข้อมูลของ {firstGame.name} และ {secondGame.name}
            </caption>
            <colgroup>
              <col className="w-1/2" />
              <col className="w-1/2" />
            </colgroup>
            <thead className="bg-blue-50 text-blue-800">
              <tr>
                <th scope="col" className="break-words border-r border-slate-200 p-3 text-center">{firstGame.name}</th>
                <th scope="col" className="break-words p-3 text-center">{secondGame.name}</th>
              </tr>
            </thead>
            {comparisonRows.map(([field, first, second]) => (
              <tbody key={field}>
                <tr>
                  <th scope="rowgroup" colSpan={2} className="border-y border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600">
                    {field}
                  </th>
                </tr>
                <tr>
                  <td className="break-words border-r border-slate-200 p-4 text-center align-top">{first}</td>
                  <td className="break-words p-4 text-center align-top">{second}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
    </>
  )
}
