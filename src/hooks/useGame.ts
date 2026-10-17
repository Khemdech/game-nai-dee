import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'

// Hook ของ Discover: ส่งการโหลดและสถานะ pending/error ให้ TanStack Query ดูแล
export function useGame(search: string = '', genres: string = '') {
    // ตัดช่องว่างหัวท้าย ให้คำค้นที่ต่างกันแค่ช่องว่างใช้ key เดียวกัน
    const searchTerm = search.trim()

    return useQuery({
        // แคชต้องแยกทั้งคำค้นและแนวเกม เพราะทั้งคู่เปลี่ยนผลจาก API
        queryKey: ['game', searchTerm, genres],
        // ส่ง signal ต่อให้ fetch เพื่อให้ยกเลิกคำขอได้ และใช้ staleTime จาก main.tsx
        queryFn: ({signal}) => getGames(searchTerm, genres, signal),
    })
}