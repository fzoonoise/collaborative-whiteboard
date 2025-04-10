import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/ModalProvider";

export const metadata: Metadata = {
  title: "Collaborative Whiteboard",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <Toaster duration={2000} />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
