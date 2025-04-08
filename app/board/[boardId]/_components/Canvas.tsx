"use client";

import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

// import { useSelf } from "@/liveblocks.config";
// import { devLog } from "@/lib/utils";

export const Canvas = () => {
  // const info = useSelf((me) => me.info);
  // devLog("Current user info", info);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};
