import { useState, useEffect } from 'react';
import {useQuery} from '@tanstack/react-query'
import { getGames } from '../api/games'

// ค้นหาใน Compare แบบ debounce: รอหยุดพิมพ์ก่อนเรียก API แต่ยังใช้แคช Query ตามปกติ
export function useGameSearch(search: string){
    const searchTerm = search.trim()
    // เก็บคำค้นที่ผ่านการรอเวลาแล้ว แยกจากข้อความล่าสุดที่ผู้ใช้กำลังพิมพ์
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // เมื่อคำค้นเปลี่ยน เริ่มรอ 500 ms; การพิมพ์ต่อจะยกเลิก timer เก่าผ่าน cleanup
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        // cleanup ทำงานก่อน effect รอบใหม่และตอนถอด component เพื่อไม่ให้ timer เก่าอัปเดตคำค้น
        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    // ต้องยาวอย่างน้อย 2 ตัวอักษร; ระหว่างคำใหม่กับคำที่รอไว้ไม่ตรงกันยังไม่เริ่ม query
    const canSearch = searchTerm.length >= 2
    const isDebouncing = searchTerm !== debouncedSearch

    // เก็บผล useQuery ในตัวแปร เพื่อคืนทั้งสถานะ API และสถานะ debounce ให้ component
    const query = useQuery({
        // รูปแบบเดียวกับ Discover; ช่องท้ายว่างคือไม่กรองแนวเกม จึงแชร์แคช All Games ได้
        queryKey: ['game', debouncedSearch, ''],
        queryFn: ({signal}) => getGames(debouncedSearch, '', signal),
        enabled: canSearch && !isDebouncing,
    })

    // ผู้เรียกใช้ query แสดงผล และใช้ canSearch/isDebouncing เลือกข้อความสถานะ
    return{
        query ,
        canSearch,
        isDebouncing,
    }
}