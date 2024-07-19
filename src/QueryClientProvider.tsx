"use client";

import {
  QueryClient,
  QueryClientProvider as RQProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <RQProvider client={queryClient}>{children}</RQProvider>;
}
