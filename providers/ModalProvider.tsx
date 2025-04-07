"use client";

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/RenameModal";

// Avoid hydration errors
// This pattern delays rendering of the <RenameModal /> component until after the client-side useEffect runs, which only happens in the browser — never during server-side rendering (SSR).
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <RenameModal />;
};
