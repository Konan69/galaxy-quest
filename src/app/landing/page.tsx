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

function getUserRows(user: User): DisplayDataRow[] {
  return [
    // { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
    { title: "points", value: user.points },
    { title: "invited_by", value: user.invitedBy },
  ];
}

export default function LandingClient() {
  const initData = useInitData();
  const username = initData?.user?.username;
  const inv_code = initData?.startParam;
  const { user: storeUser, setUser } = useUserStore();
  const createUserMutation = useRegisterUserMutation();

  useEffect(() => {
    if (!storeUser && username) {
      createUserMutation.mutate({ username, inv_code } as any);
    }
  }, [username]);

  const userRows = useMemo(() => {
    return storeUser ? getUserRows(storeUser) : undefined;
  }, [storeUser]);

  if (!username) return <div>Please set username in telegram</div>;
  if (createUserMutation.isPending) return <div>Loading...</div>;
  return (
    <div className="overflow-y-auto">
      {storeUser && <DisplayData rows={getUserRows(storeUser)} />}
      Invite code = {inv_code}
    </div>
  );
}
