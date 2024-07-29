import {
  User as PrismaUser,
  UserTasks as PrismaUserTasks,
} from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserTasks extends PrismaUserTasks {}

interface UserWithTasks extends PrismaUser {
  tasks: UserTasks;
}

interface UserStore {
  user: UserWithTasks | null;
  error: Error | null;
  setUser: (user: UserWithTasks | null) => void;
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
