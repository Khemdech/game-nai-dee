import {useQuery} from '@tanstack/react-query'
import {getGameById} from '../api/games'

export function useGameDetail(id: number | undefined) {
    const isValidId = id !== undefined && Number.isInteger(id) && id > 0

    return useQuery({
    queryKey: ['game-detail', id],
    enabled: isValidId,
    queryFn: ({ signal }) => {
      if (id === undefined) {
        throw new Error('Game ID is undefined')
      }

      return getGameById(id, signal)
    },
  })
}