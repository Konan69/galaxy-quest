import { useUserStore } from "@/components/Store/userStore";
import { useToast } from "@/components/ui/use-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";

interface AddPointsData {
  username: string;
  points: number;
}
interface MembershipCheckResponse {
  isUserInGroup: boolean;
}

//prettier-ignore
const createUser = async ({
  username,inv_code}: { username: string;inv_code?: string}) => 
  {const { data } = await axios.post("/api/user", { username, inv_code });
  return data;
};

//prettier-ignore
const updateWallet = async({username, wallet} : { username: string; wallet: string}) => {
  const { data } = await axios.post("/api/wallet", { username, wallet });
  return data
}
//prettier-ignore
const isMemeber = async ({ userId, groupId }: { userId: number; groupId: string | number }) => {
  const { data } = await axios.get<MembershipCheckResponse>(
    `/api/check-member?userId=${userId}&groupId=${groupId}`,
  );
  return data;
}

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

// export const useIsMemberQuery = () => {
//   const { setUser, setError } = useUserStore();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: isMemeber,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["user", data.username], data);
//       setUser(data);
//     },
//     onError: (error) => {
//       setError(new Error(`Unknown error: ${String(error)}`));
//       setUser(null);
//     },
//   });
// };

export const useMembershipCheck = ({
  userId,
  groupId,
}: {
  userId: number;
  groupId: string | number;
}) => {
  return useQuery({
    queryKey: ["membershipCheck", userId, groupId],
    queryFn: () => isMemeber({ userId, groupId }),
    select: (data) => ({
      isMember: data.isUserInGroup,
      runFunction: (callback: (isMember: boolean) => void) => {
        callback(data.isUserInGroup);
      },
    }),
  });
};

const addPoints = async ({ username, points }: AddPointsData) => {
  const { data } = await axios.post("/api/points", { username, points });
  return data;
};
export const useAddPointsMutation = () => {
  const { user: storeUser, setUser, setError } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPoints,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data);
      setUser(data);
    },
    onError: (error) => {
      setError(new Error(`Unknown error: ${String(error)}`));
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

export const useSetWalletMutation = () => {
  const { user: storeUser, setUser, setError } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWallet,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.username], data);
      setUser(data);
    },
    onError: (error) => {
      setError(new Error(`Unknown error: ${String(error)}`));
      console.error(error);
    },
  });
};
