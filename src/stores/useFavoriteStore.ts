import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

// กำหนดชนิด state/actions; เก็บเฉพาะ ID ส่วนชื่อ รูป และรายละเอียดอยู่ใน Query cache
interface FavoritesState { 
    favoriteIds : number[];
    addFavorite: (id: number) => void;
    removeFavorite: (id: number) => void;
}

// Zustand แชร์รายการโปรดข้ามหน้า ส่วน persist ช่วยจำค่าเมื่อรีเฟรชหรือเปิดใหม่
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],

      // รับ ID ที่ถูกต้องเท่านั้น และใช้ state ล่าสุดใน set เพื่อป้องกันรายการซ้ำ
      addFavorite: (id) => {
        if (!Number.isSafeInteger(id) || id <= 0) {
          return
        }

        set((state) => {
          if (state.favoriteIds.includes(id)) {
            return state
          }

          return {
            favoriteIds: [...state.favoriteIds, id],
          }
        })
      },

      // filter สร้าง array ใหม่โดยตัด ID เป้าหมาย ไม่แก้ array เดิมโดยตรง
      removeFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id,
          ),
        }))
      },
    }),
    {
      // ชื่อ key ใน localStorage แยกจาก Compare; storage ของแต่ละ origin ไม่ได้ใช้ร่วมกัน
      name: 'game-nai-dee-favorites',
      storage: createJSONStorage(() => localStorage),
      // บันทึกเฉพาะ favoriteIds ไม่บันทึกฟังก์ชันหรือ response API ทั้งก้อน
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
)