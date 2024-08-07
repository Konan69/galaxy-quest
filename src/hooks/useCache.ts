// hooks/useCache.ts
import { UserWithTasks } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export const useGetUser = (): UserWithTasks | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<UserWithTasks>(["user"]);
};

// const getMembershipFromCache = (userId: any, groupId: any) => {
//   return queryClient.getQueryData(["membershipCheck", userId, groupId]);
// };
