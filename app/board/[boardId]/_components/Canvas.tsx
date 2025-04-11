"use client";

import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

// import { useSelf } from "@/liveblocks.config";
// import { devLog } from "@/lib/utils";

type CanvasProps = {
  boardId: string;
};

export const Canvas = ({ boardId }: CanvasProps) => {
  // const info = useSelf((me) => me.info);
  // devLog("Current logged-in user info", info);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar />
    </main>
  );
};
