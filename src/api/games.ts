import type {Game, GameDetail, GamesResponse} from '../types/game'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

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

export async function getGames(search: string = '', genres: string = '',
  signal?: AbortSignal,): Promise<GamesResponse> {
    const apiKey = import.meta.env.VITE_RAWG_API_KEY

    if(typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error('API key is not set. Please set the VITE_RAWG_API_KEY environment variable.')
    }

    const url = new URL('https://api.rawg.io/api/games')
    url.searchParams.set('key', apiKey.trim())
    if (search.trim() !== '') {
        url.searchParams.set('search', search.trim())
    }
    url.searchParams.set('page_size', '20')

    if (genres !== '') {
        url.searchParams.set('genres', genres)
    }

    const response = await fetch(url, { signal })

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`)
    }

    const data = await response.json()

    if (!isGamesResponse(data)) {
        throw new Error('Invalid response format from the API')
    }
    
    return data
}

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

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch game details (${response.status})`)
  }

  const data: unknown = await response.json()

  if (!isGameDetail(data)) {
    throw new Error('Invalid response format from the API')
  }

  return data
}