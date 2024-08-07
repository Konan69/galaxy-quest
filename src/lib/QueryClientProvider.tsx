"use client";

import {
  QueryClient,
  QueryClientProvider as RQProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RQProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </RQProvider>
  );
}
