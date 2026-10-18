// ชนิดข้อมูลที่แอปใช้จาก RAWG เป็นเพียงส่วนหนึ่งของ response ทั้งหมด
export interface Genre {
  id: number
  name: string
}

// ข้อมูลสรุปสำหรับการ์ดรายการ; รูปอาจเป็น null และ genres เป็นรายการแนวเกม
export interface Game {
  id: number
  name: string
  background_image: string | null
  rating: number
  genres: Genre[]
}

// count คือจำนวนผลทั้งหมด ส่วน results คือข้อมูลเฉพาะหน้าที่ขอ ไม่จำเป็นต้องมีครบ 20
export interface GamesResponse {
    count: number
    next: string | null
    previous: string | null
    results: Game[]
}   

// แพลตฟอร์มมี ID และชื่อ เช่น PC; GamePlatform เป็นรูปแบบ object ที่ API ห่อไว้อีกชั้น
export interface Platform {
  id: number
  name: string
}

export interface GamePlatform {
  platform: Platform
}

// extends ใช้ฟิลด์ Game เดิมแล้วเพิ่มรายละเอียด; null ต้องแสดง fallback ในหน้าเว็บ
export interface GameDetail extends Game {
  description_raw: string
  released: string | null
  metacritic: number | null
  platforms: GamePlatform[] | null
}