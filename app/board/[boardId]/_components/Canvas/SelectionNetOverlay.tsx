"use client";

import { canvasMode } from "@/constants/canvasConstants";
import { CanvasState } from "@/types/canvas.types";

type SelectionNetOverlayProps = {
  canvasState: CanvasState;
};

export const SelectionNetOverlay = ({
  canvasState,
}: SelectionNetOverlayProps) => {
  if (canvasState.mode !== canvasMode.SelectionNet || !canvasState.current)
    return;
  return (
    <rect
      className="fill-blue-500/5 stroke-blue-500 stroke-1"
      x={Math.min(canvasState.origin.x, canvasState.current.x)}
      y={Math.min(canvasState.origin.y, canvasState.current.y)}
      width={Math.abs(canvasState.origin.x - canvasState.current.x)}
      height={Math.abs(canvasState.origin.y - canvasState.current.y)}
    />
  );
};
