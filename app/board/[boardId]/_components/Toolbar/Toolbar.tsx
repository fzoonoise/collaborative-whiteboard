"use client";

import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  TypeIcon,
  Undo2,
} from "lucide-react";
import { type CanvasState } from "@/types/canvas.types";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./ToolButton";
import { canvasMode, layerType } from "@/constants/canvasConstants";

type ToolbarProps = {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select (Ctrl+A)"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: canvasMode.None })}
          isActive={
            canvasState.mode === canvasMode.None ||
            canvasState.mode === canvasMode.Translating ||
            canvasState.mode === canvasMode.SelectionNet ||
            canvasState.mode === canvasMode.Pressing ||
            canvasState.mode === canvasMode.Resizing
          }
        />
        <ToolButton
          label="Text (Ctrl+T)"
          icon={TypeIcon}
          onClick={() =>
            setCanvasState({
              layerType: layerType.Text,
              mode: canvasMode.Inserting,
            })
          }
          isActive={
            canvasState.mode === canvasMode.Inserting &&
            canvasState.layerType === layerType.Text
          }
        />
        <ToolButton
          label="Sticky Note (Ctrl+N)"
          icon={StickyNote}
          onClick={() =>
            setCanvasState({
              mode: canvasMode.Inserting,
              layerType: layerType.Note,
            })
          }
          isActive={
            canvasState.mode === canvasMode.Inserting &&
            canvasState.layerType === layerType.Note
          }
        />
        <ToolButton
          label="Rectangle (Ctrl+R)"
          icon={Square}
          onClick={() =>
            setCanvasState({
              mode: canvasMode.Inserting,
              layerType: layerType.Rectangle,
            })
          }
          isActive={
            canvasState.mode === canvasMode.Inserting &&
            canvasState.layerType === layerType.Rectangle
          }
        />
        <ToolButton
          label="Ellipse (Ctrl+E)"
          icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: canvasMode.Inserting,
              layerType: layerType.Ellipse,
            })
          }
          isActive={
            canvasState.mode === canvasMode.Inserting &&
            canvasState.layerType === layerType.Ellipse
          }
        />
        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: canvasMode.Pencil,
            })
          }
          isActive={canvasState.mode === canvasMode.Pencil}
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo (Ctrl+Z)"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo (Ctrl+Shift+Z)"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 rounded-md animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] h-[360px] w-[52px]">
      <Skeleton />
    </div>
  );
};

export default Toolbar;
