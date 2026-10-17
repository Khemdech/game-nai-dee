import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface FavoritesState { 
    favoriteIds : number[];
    addFavorite: (id: number) => void;
    removeFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],

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

      removeFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id,
          ),
        }))
      },
    }),
    {
      name: 'game-nai-dee-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
)