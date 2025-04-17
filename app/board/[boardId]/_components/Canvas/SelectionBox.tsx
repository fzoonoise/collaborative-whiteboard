"use client";

import { memo } from "react";

import { useSelf, useStorage } from "@/liveblocks.config";
import { type Rect, Side } from "@/types/canvas.types";
import { layerType } from "@/constants/canvasConstants";
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
// import { devLog } from "@/lib/utils";

type SelectionBoxProps = {
  handleResizePointerDown: (corner: Side, initialBounds: Rect) => void;
};

const HANDLE_SQUARE_SIZE = 6;

export const SelectionBox = memo(
  ({ handleResizePointerDown }: SelectionBoxProps) => {
    const soleUseLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleUseLayerId && root.layers.get(soleUseLayerId)?.type !== layerType.Path
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Top + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x + bounds.width / 2 - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Top, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x + bounds.width - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Top + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x + bounds.width - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y + bounds.height / 2 - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x + bounds.width - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y + bounds.height - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Right + Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x + bounds.width / 2 - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y + bounds.height - HANDLE_SQUARE_SIZE / 2}px)
                    `,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y + bounds.height - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Left + Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_SQUARE_SIZE}px`,
                height: `${HANDLE_SQUARE_SIZE}px`,
                transform: `
                    translate(
                        ${bounds.x - HANDLE_SQUARE_SIZE / 2}px,
                        ${bounds.y + bounds.height / 2 - HANDLE_SQUARE_SIZE / 2}px
                    )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizePointerDown(Side.Left, bounds);
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
