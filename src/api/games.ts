import type {Game, GameDetail, GamesResponse} from '../types/game'

// จุดเริ่มตรวจข้อมูลจากภายนอก: unknown ต้องเป็น object ที่ไม่ใช่ null ก่อนอ่าน property
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Type guard ตรวจฟิลด์ที่ UI ต้องใช้จริง แล้วช่วย TypeScript รู้ว่าเป็น Game
// interface อย่างเดียวไม่ตรวจ JSON ตอนรัน จึงต้องมีการตรวจนี้ด้วย
function isGame(value: unknown): value is Game {
    if (!isRecord(value)) {
        return false
    }
    return (
        typeof value.id === 'number' &&
        typeof value.name === 'string' &&
        (typeof value.background_image === 'string' || value.background_image === null) &&
        typeof value.rating === 'number' &&
        Array.isArray(value.genres) && value.genres.every((genre:unknown)=> isRecord(genre) && typeof genre.id === 'number' && typeof genre.name === 'string',)
    )
}

// ตรวจโครง response และตรวจสมาชิกทุกตัวใน results ไม่ได้เชื่อเพียงชื่อ type
function isGamesResponse(value: unknown): value is GamesResponse {
    if (!isRecord(value)) {
        return false
    }
    return (
        typeof value.count === 'number' &&
        (typeof value.next === 'string' || value.next === null) &&
        (typeof value.previous === 'string' || value.previous === null) &&
        Array.isArray(value.results) && value.results.every(isGame)
    )
}

// โหลดรายการตามคำค้น/แนวเกม; signal รับการยกเลิกคำขอจาก TanStack Query
export async function getGames(search: string = '', genres: string = '',
  signal?: AbortSignal,): Promise<GamesResponse> {
    // Vite อ่านค่าจาก env; ค่า VITE_ อยู่ในเบราว์เซอร์ได้ จึงไม่ใช่ secret ฝั่ง server
    const apiKey = import.meta.env.VITE_RAWG_API_KEY

    if(typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error('API key is not set. Please set the VITE_RAWG_API_KEY environment variable.')
    }

    // ใช้ URLSearchParams ประกอบคำขอเพื่อเข้ารหัสค่า search และไม่ต่อ query string เอง
    const url = new URL('https://api.rawg.io/api/games')
    url.searchParams.set('key', apiKey.trim())
    if (search.trim() !== '') {
        url.searchParams.set('search', search.trim())
    }
    // ขอผลหน้าแรกสูงสุด 20 เกม; กล่อง Compare จะเลือกแสดงเพียง 5 ผลแรกอีกชั้น
    url.searchParams.set('page_size', '20')

    if (genres !== '') {
        url.searchParams.set('genres', genres)
    }

    // fetch ไม่ throw เพียงเพราะ HTTP 4xx/5xx จึงต้องตรวจ response.ok ต่อ
    const response = await fetch(url, { signal })

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`)
    }

    // แปลง JSON แล้วตรวจรูปแบบก่อนคืนข้อมูลให้ Query และ UI
    const data = await response.json()

    if (!isGamesResponse(data)) {
        throw new Error('Invalid response format from the API')
    }
    
    return data
}

// รายละเอียดใช้ฟิลด์ของ Game ร่วมกัน แล้วตรวจฟิลด์เพิ่มรวม platform ที่ซ้อนอยู่
// รองรับ null ตามข้อมูลที่ API อาจไม่มี เพื่อให้ UI แสดงข้อความสำรอง
function isGameDetail(value: unknown): value is GameDetail {
    if (!isRecord(value) || !isGame(value)) {
        return false
    }

    return (
    typeof value.description_raw === 'string' &&
    (typeof value.released === 'string' || value.released === null) &&
    (typeof value.metacritic === 'number' || value.metacritic === null) &&
    (
      value.platforms === null ||
      (
        Array.isArray(value.platforms) &&
        value.platforms.every(
          (item: unknown) =>
            isRecord(item) &&
            isRecord(item.platform) &&
            typeof item.platform.id === 'number' &&
            typeof item.platform.name === 'string',
        )
      )
    )
  )
}

// โหลดรายละเอียดหนึ่งเกม: รับเฉพาะ ID จำนวนเต็มบวกที่ปลอดภัยต่อการคำนวณของ JavaScript
export async function getGameById(
  id: number,
  signal?: AbortSignal,
): Promise<GameDetail | null> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Game ID must be a positive integer')
  }

  const apiKey: unknown = import.meta.env.VITE_RAWG_API_KEY

  if (typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('please set the VITE_RAWG_API_KEY environment variable.')
  }

  const url = new URL(`https://api.rawg.io/api/games/${id}`)
  url.searchParams.set('key', apiKey.trim())

  const response = await fetch(url, { signal })

  // ไม่พบเกมเป็นผลลัพธ์ null เพื่อแยกจากเครือข่ายล้มเหลวหรือ HTTP error อื่น
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch game details (${response.status})`)
  }

  // ใช้ unknown เพื่อบังคับตรวจข้อมูลก่อนนำฟิลด์ใน response มาใช้
  const data: unknown = await response.json()

  if (!isGameDetail(data)) {
    throw new Error('Invalid response format from the API')
  }

  return data
}