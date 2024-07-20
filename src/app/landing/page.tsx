"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData, User } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";
import { useMemo, useEffect, useRef } from "react";

// Function to fetch user data from the API
const fetchUser = async (username: string) => {
  const { data } = await axios.get(`/api/user/${username}`);
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
  const userCreationAttempted = useRef(false);

  const {
    data: user,
    isError,
    isLoading,
    error,
    status,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username!),
    enabled: !!username,
    staleTime: Infinity, // Cache the data indefinitely
    retry: false, // Don't retry on error
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", username], data);
    },
  });

  useEffect(() => {
    if (
      status === "error" &&
      axios.isAxiosError(error) &&
      error.response?.status === 404 &&
      !userCreationAttempted.current &&
      username
    ) {
      userCreationAttempted.current = true;
      createUserMutation.mutate(username);
    }
  }, [status, error, username, createUserMutation]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  if (!username) return <div>Please set username in telegram</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return <div>User not found. Creating new user...</div>;
    }
    return <div>Failed to load user data</div>;
  }

  return (
    <>
      <List>{userRows && <DisplayData header={"User"} rows={userRows} />}</List>
      <div>{user?.username}</div>
    </>
  );
}
