import { useUserStore } from "@/components/Store/userStore";
import { useToast } from "@/components/ui/use-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";

interface AddPointsData {
  username: string;
  points: number;
}

//prettier-ignore
const createUser = async ({
  username,inv_code}: { username: string;inv_code?: string}) => 
  {const { data } = await axios.post("/api/user", { username, inv_code });
  return data;
};

const getUser = async ({ username }: { username: string }) => {
  const { data } = await axios.get(`/api/user?username=${username}`);
  return data;
};

// prettier-ignore
const updateTask = async ({ taskId, username, points, }: { taskId: string; username: string; points: number;
}) => { const { data } = await axios.post("/api/tasks", { taskId, username,  points,});
  return data;
};
export const useRegisterUserMutation = () => {
  const { user: storeUser, setUser } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data), setUser(data);
    },
  });
};

export const useGetUserQuery = () => {
  const { user: storeUser, setUser } = useUserStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data);
      setUser(data);
    },
    onError: (error) => {
      setUser(null);
    },
  });
};

const addPoints = async ({ username, points }: AddPointsData) => {
  const { data } = await axios.post("/api/points", { username, points });
  return data;
};
export const useAddPointsMutation = () => {
  const { user: storeUser, setUser } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPoints,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data);
      setUser(data);
    },
  });
};

export const useUpdateTaskMutation = () => {
  const { setUser, setError, clearError } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onMutate: () => {
      clearError();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data);
      setUser(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setError(new Error(error.response.data.message));
        } else {
          setError(new Error(`Network error: ${error.message}`));
        }
      } else if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error(`Unknown error: ${String(error)}`));
      }
    },
  });
};
