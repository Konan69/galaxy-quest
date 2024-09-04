import { UserStore } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

type StoreState = {
  selectedPfp: string | null;
  setSelectedPfp: (src: string) => void;
};

export const usePFPStore = create<StoreState>((set) => ({
  selectedPfp: null,
  setSelectedPfp: (src: string) => set({ selectedPfp: src }),
}));

interface InitData {
  telegramId: number | null;
  error: Error | null;
  setTelegramId: (user: any) => void;
  setError: (error: any) => void;
  clearError: () => void;
}

export const useTelegramId = create<InitData>((set) => ({
  telegramId: null,
  error: null,
  setTelegramId: (id: any) => set({ telegramId: id }),
  setError: (error: any) => set({ error }),
  clearError: () => set({ error: null }),
}));
