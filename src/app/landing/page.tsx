"use client";

import { useQuery } from "@tanstack/react-query";

import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData, User } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";
import { useMemo } from "react";

// Function to fetch user data from the API
const fetchUser = async (username: string) => {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return res.json();
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
    data: user,
    error,
    isLoading,
  } = useQuery({ queryKey: ["user"], queryFn: () => fetchUser(username!) });

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  if (error) return <div>Failed to load user data</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <List>{userRows && <DisplayData header={"User"} rows={userRows} />}</List>
      <div>{user}</div>
    </>
  );
}
