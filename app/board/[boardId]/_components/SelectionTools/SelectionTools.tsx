"use client";

import { memo, useState } from "react";
import { Trash2, Palette, Copy } from "lucide-react";

import { useMutation, useSelf } from "@/liveblocks.config";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { Camera, Color } from "@/types/canvas.types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BringToFrontIcon, SendToBackIcon } from "@/components/Icon";
import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
// import { devLog } from "@/lib/utils";

type SelectionToolsProps = {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
  handleDuplicateLayers: () => void;
};

export const SelectionTools = memo(
  ({
    camera,
    setLastUsedColor,
    handleDuplicateLayers,
  }: SelectionToolsProps) => {
    const [open, setOpen] = useState(false);

    const selection = useSelf((me) => me.presence.selection);

    const handleMoveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const selectedIndices: number[] = [];
        const layersArr = liveLayerIds.toImmutable();

        for (let i = 0; i < layersArr.length; i++) {
          if (selection.includes(layersArr[i])) {
            selectedIndices.push(i);
          }
        }

        const lastSelectedIndex = selectedIndices.length - 1;
        for (let i = lastSelectedIndex; i >= 0; i--) {
          liveLayerIds.move(
            selectedIndices[i], // from
            layersArr.length - 1 - (lastSelectedIndex - i) // to
          );
        }
      },
      [selection]
    );

    const handleMoveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const selectedIndices: number[] = [];
        const layersArr = liveLayerIds.toImmutable();

        for (let i = 0; i < layersArr.length; i++) {
          if (selection.includes(layersArr[i])) {
            selectedIndices.push(i);
          }
        }

        for (let i = 0; i < selectedIndices.length; i++) {
          liveLayerIds.move(
            selectedIndices[i], // from
            i // to
          );
        }
      },
      [selection]
    );

    const handleFillChange = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);
        if (!selection) {
          return;
        }

        selection.forEach((id) => liveLayers.get(id)?.set("fill", fill));
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();
    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const toolsX = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const toolsY = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-1.5 rounded-md bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(
                calc(${toolsX}px - 50%),
                calc(${toolsY - 16}px - 100%)
            )`,
        }}
      >
        <div className="flex gap-1 items-center">
          <Hint sideOffset={12} label="Bring to front">
            <Button onClick={handleMoveToFront} variant="board" size="icon">
              <BringToFrontIcon />
            </Button>
          </Hint>
          <Hint sideOffset={12} label="Send to back">
            <Button onClick={handleMoveToBack} variant="board" size="icon">
              <SendToBackIcon />
            </Button>
          </Hint>

          <TooltipProvider>
            <Tooltip delayDuration={100} open={open} onOpenChange={setOpen}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  variant="board"
                  size="icon"
                >
                  <Palette />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="rounded-md px-[6px] shadow-none"
                sideOffset={10}
              >
                <ColorPicker handleFillChange={handleFillChange} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Hint sideOffset={12} label="Duplicate (ctrl + D)">
            <Button onClick={handleDuplicateLayers} variant="board" size="icon">
              <Copy />
            </Button>
          </Hint>

          <hr className="h-[70%] mx-1 border border-black" />
          <Hint sideOffset={12} label="Delete">
            <Button size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
