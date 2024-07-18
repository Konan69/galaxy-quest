"use client";

import {
  DisplayData,
  DisplayDataRow,
} from "@/components/DisplayData/DisplayData";
import { useInitData, User } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";
import { useMemo } from "react";

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
  ];
}

export default function Landing() {
  const initData = useInitData();

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  return (
    <List>{userRows && <DisplayData header={"User"} rows={userRows} />}</List>
  );
}
