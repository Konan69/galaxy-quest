import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import QueryClientProvider from "@/lib/QueryClientProvider";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pugs",
  description: "Your application description goes here",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className="min-h-screen min-w-full bg-cover bg-repeat-x bg-fixed "
        style={{
          backgroundImage: "url(/bg.png)",
        }}
      >
        <QueryClientProvider>
          <div className="relative min-h-screen pb-16">
            <Root>{children}</Root>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
