import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import QueryClientProvider from "@/QueryClientProvider";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import Navbar from "@/components/NavBar/Navbar";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <div className="relative min-h-screen pb-16">
            <Root>{children}</Root> {/* Main content */}
            <Navbar />
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
