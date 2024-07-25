"use client";
import { useRegisterUserMutation } from "@/mutations/mutations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData } from "@telegram-apps/sdk-react";
import { useMemo, useEffect } from "react";
import { useUserStore } from "@/components/Store/userStore";
import { User } from "@prisma/client";

// Function to fetch user data from the API
const fetchUser = async (username: string) => {
  const { data } = await axios.get(`/api/user?username=${username}`);
  return data;
};

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
    { title: "points", value: user.points },
    { title: "invited_by", value: user.invitedBy },
    // { title: "purchases", value: user.purchases },
  ];
}

export default function LandingClient() {
  const initData = useInitData();
  const username = initData?.user?.username;
  const { user: storeUser, setUser } = useUserStore();
  const createUserMutation = useRegisterUserMutation();

  useEffect(() => {
    if (!storeUser && username) {
      createUserMutation.mutate(username);
    }
  }, [username]);

  const userRows = useMemo(() => {
    return storeUser ? getUserRows(storeUser) : undefined;
  }, [storeUser]);

  if (!username) return <div>Please set username in telegram</div>;
  if (createUserMutation.isPending) return <div>Loading...</div>;
  return <>{storeUser && <DisplayData rows={getUserRows(storeUser)} />}</>;
}
