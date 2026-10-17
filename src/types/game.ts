export interface Genre {
  id: number
  name: string
}

export interface Game {
  id: number
    name: string
    background_image: string | null
    rating: number
    genres: Genre[]
}

export interface GamesResponse {
    count: number
    next: string | null
    previous: string | null
    results: Game[]
}   

export interface Platform {
  id: number
  name: string
}

export interface GamePlatform {
  platform: Platform
}

export interface GameDetail extends Game {
  description_raw: string
  released: string | null
  metacritic: number | null
  platforms: GamePlatform[] | null
}