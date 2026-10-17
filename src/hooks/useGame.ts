import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'

export function useGame(search: string = '', genres: string = '') {
    const searchTerm = search.trim()

    return useQuery({
        queryKey: ['game', searchTerm, genres],
        queryFn: ({signal}) => getGames(searchTerm, genres, signal),
    })
}