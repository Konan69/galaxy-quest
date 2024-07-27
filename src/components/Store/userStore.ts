import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  error: Error | null;
  setUser: (user: User | null) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

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
