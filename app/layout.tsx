import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import "./globals.css";
import { Loading } from "@/components/auth/Loading";

export const metadata: Metadata = {
  title: "Collaborative Whiteboard",
  description: "",
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading/>}>
        <ConvexClientProvider>
          <Toaster duration={2000} />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
