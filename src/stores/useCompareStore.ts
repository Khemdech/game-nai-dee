import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// เก็บ ID เรียงลำดับ: ตัวแรกคือซ้าย ตัวที่สองคือขวา ไม่ได้เก็บช่องว่างแยกอิสระ
interface CompareState {
    compareIds: number[]
    addCompare: (id: number) => void;
    removeCompare: (id: number) => void;
    clearCompare: () => void;
    replaceCompare: (currentId: number, newId: number) => void;
}

// ทุกหน้าที่เลือก Compare อ่าน state ชุดนี้ร่วมกัน และ persist เฉพาะ IDs
export const useCompareStore = create<CompareState>()(
    persist((set) => ({compareIds: [],
        // เพิ่มได้เมื่อ ID ถูกต้อง ไม่ซ้ำ และยังมีไม่ครบสองเกม
        addCompare: (id) => {
            if (!Number.isSafeInteger(id) || id <= 0) {
                return
            }

            set((state) => {
                if (state.compareIds.includes(id) || state.compareIds.length >= 2) {
                    return state
                }
                return {
                    compareIds: [...state.compareIds, id],
                }
            })
        },
        // แทนเกมเดิมในตำแหน่งเดิมด้วย map จึงไม่ทำให้อีกเกมสลับฝั่ง
        replaceCompare: (currentId, newId) => {
            if(!Number.isSafeInteger(newId) || newId <= 0) {
                return
            }
            set((state) => {
                // ต้องพบเกมเดิม และเกมใหม่ต้องยังไม่ถูกเลือก รวมถึงไม่แทนด้วย ID เดิมซ้ำ
                if(!state.compareIds.includes(currentId) || state.compareIds.includes(newId)) {
                    return state
                }

                return {
                    compareIds: state.compareIds.map((id) => id === currentId ? newId : id),
                }
            })
        },
        // filter ตัด ID ออก; ถ้าลบตัวแรก ตัวที่สองจะเลื่อนมาเป็นฝั่งซ้าย
        removeCompare: (id) => {
            set((state) => ({
                compareIds: state.compareIds.filter(
                    (compareId) => compareId !== id,
                ),
            }))
        },
        // ล้างรายการด้วย array ว่าง; persist จะบันทึกค่าที่ล้างแล้วด้วย
        clearCompare: () => {
            set({ compareIds: [] })
        },
    }),
    {
        name: 'game-nai-dee-compare',
        storage: createJSONStorage(() => localStorage),
        // คงไว้เฉพาะ compareIds ใน localStorage ส่วนรายละเอียดโหลดผ่าน useGameDetail
        partialize: (state) => ({
            compareIds: state.compareIds,   
        }),
    }),
)