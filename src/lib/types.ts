import {
  User as PrismaUser,
  UserTasks as PrismaUserTasks,
} from "@prisma/client";

export type IconProps = {
  size?: number;
  className?: string;
};

export interface UserTasks extends PrismaUserTasks {}

export interface UserWithTasks extends PrismaUser {
  tasks: UserTasks;
}

export interface UserStore {
  user: UserWithTasks | null;
  error: Error | null;
  setUser: (user: UserWithTasks | null) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
}
