import { useUserStore } from "@/components/Store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
interface AddPointsData {
  username: string;
  points: number;
}

// Function to create a new user
const createUser = async (username: string) => {
  const { data } = await axios.post("/api/user", { username });
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
