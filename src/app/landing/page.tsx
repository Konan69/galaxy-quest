"use client";

// cache the username, ui error handling for if user hasnt set username in telegram
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData, User } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";
import { useMemo, useEffect } from "react";

// Function to fetch user data from the API
const regUser = async (username: string) => {
  const { data } = await axios.post("/api/user", { username });
  return data;
};

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
  ];
}

export default function Landing() {
  const initData = useInitData();
  const username = initData?.user?.username!;

  const {
    mutate,
    data: user,
    error,
  } = useMutation({
    mutationFn: () => regUser(username!),
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to register user:", error);
    },
  });

  // Trigger mutation when the username is available
  useEffect(() => {
    if (username) {
      mutate();
    }
  }, []);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  if (error) return <div>Failed to load user data</div>;
  console.log(error);
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <List>{userRows && <DisplayData header={"User"} rows={userRows} />}</List>
      <div>{user.username}</div>
    </>
  );
}
