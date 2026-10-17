import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CompareState {
    compareIds: number[]
    addCompare: (id: number) => void;
    removeCompare: (id: number) => void;
    clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
    persist((set) => ({compareIds: [],
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
        removeCompare: (id) => {
            set((state) => ({
                compareIds: state.compareIds.filter(
                    (compareId) => compareId !== id,
                ),
            }))
        },
        clearCompare: () => {
            set({ compareIds: [] })
        },
    }),
    {
        name: 'game-nai-dee-compare',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            compareIds: state.compareIds,   
        }),
    }),
)