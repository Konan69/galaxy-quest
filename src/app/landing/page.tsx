"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData, User } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";
import { useMemo, useEffect } from "react";

// Function to fetch user data from the API
const fetchUser = async (username: string) => {
  const { data } = await axios.get(`/api/user?username=${username}`);
  return data;
};

// Function to create a new user
const createUser = async (username: string) => {
  const { data } = await axios.post("/api/user", { username });
  return data;
};

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
  ];
}

export default function LandingClient() {
  const initData = useInitData();
  const username = initData?.user?.username;
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", username], data);
    },
  });

  const {
    data: user,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username!),
    enabled: !!username,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (
      isError &&
      axios.isAxiosError(error) &&
      error.response?.status === 404 &&
      username &&
      createUserMutation.status !== "pending"
    ) {
      createUserMutation.mutate(username, {
        onSuccess: (data) => {
          queryClient.setQueryData(["user", username], data);
        },
        onError: (createError) => {
          if (
            axios.isAxiosError(createError) &&
            createError.response?.status === 400
          ) {
            // If creation fails due to existing user, refetch the user data
            refetch();
          }
        },
      });
    }
  }, [isError, error, username, createUserMutation, refetch, queryClient]);

  const userRows = useMemo(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  if (!username) return <div>Please set username in telegram</div>;
  if (isLoading) return <div>Loading...</div>;
  if (createUserMutation.status === "pending" && !user)
    return <div>Loading...</div>;
  // if (isError) {
  //   return <div>Failed to load user data</div>;
  // }

  return (
    <>
      {userRows && <DisplayData rows={userRows} />}
      <div>{user?.username}</div>
    </>
  );
}
