import {useQuery} from '@tanstack/react-query'
import {getGameById} from '../api/games'

// Details, Collection และ Compare ใช้ Hook นี้ร่วมกัน จึงแชร์แคชเมื่อ ID ตรงกัน
export function useGameDetail(id: number | undefined) {
    // ตรวจขั้นต้นก่อนเปิด query; ฟังก์ชัน API ตรวจ safe integer ซ้ำก่อนส่งคำขอ
    const isValidId = id !== undefined && Number.isInteger(id) && id > 0

    return useQuery({
    queryKey: ['game-detail', id],
    // ช่อง Compare ที่ยังไม่มี ID ไม่ต้องขอ API แม้ยังเรียก Hook ตามลำดับปกติ
    enabled: isValidId,
    queryFn: ({ signal }) => {
      // ป้องกันค่า undefined ภายใน queryFn และช่วยให้ TypeScript ยืนยันชนิดก่อนส่งต่อ
      if (id === undefined) {
        throw new Error('Game ID is undefined')
      }

      return getGameById(id, signal)
    },
  })
}