"use client";

import { useState } from "react";
import { useHistory, useCanUndo, useCanRedo } from "@/liveblocks.config";

import Info from "./Info";
import Participants from "../Participants/Participants";
import Toolbar from "../Toolbar/Toolbar";
import { type CanvasState } from "@/types/canvas.types";
import { canvasMode } from "@/constants/canvasConstants";

// import { useSelf } from "@/liveblocks.config";
// import { devLog } from "@/lib/utils";

type CanvasProps = {
  boardId: string;
};

export const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: canvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // const info = useSelf((me) => me.info);
  // devLog("Current logged-in user info", info);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
    </main>
  );
};
