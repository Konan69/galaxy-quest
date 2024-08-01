"use client";
import {
  useGetUserQuery,
  useRegisterUserMutation,
} from "@/mutations/mutations";
import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData } from "@telegram-apps/sdk-react";
import { useMemo, useEffect } from "react";
import { useUserStore, useTelegramId } from "@/components/Store/userStore";

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
  const username = useMemo(
    () => initData?.user?.username,
    [initData?.user?.username],
  ); //gek[]
  const inv_code = initData?.startParam;
  const { user: storeUser } = useUserStore();
  const { telegramId, setTelegramId } = useTelegramId();
  const createUserMutation = useRegisterUserMutation();
  const getUserMutation = useGetUserQuery();

  useEffect(() => {
    if (!storeUser && username) {
      createUserMutation.mutate({ username, inv_code } as any);
      setTelegramId(initData?.user?.id);
    }
    if (storeUser) {
      getUserMutation.mutate({ username } as any);
      setTelegramId(initData?.user?.id);
    }
  }, [username]);

  if (!username) return <div>Please set username in telegram</div>;
  if (createUserMutation.isPending) return <div>Loading...</div>;
  return (
    <div className="overflow-y-auto pb-16">
      {storeUser && <DisplayData rows={getUserRows(storeUser)} />}
      Invite code = {inv_code}
    </div>
  );
}
