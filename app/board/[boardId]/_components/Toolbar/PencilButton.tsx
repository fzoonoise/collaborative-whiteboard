"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { StrokeKey, StrokeWidth } from "@/types/canvas.types";
import { strokeWidths } from "@/constants/canvasConstants";
import { useDrawingSettingsStore } from "@/store/useDrawingSettingsStore";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type PencilButtonProps = {
  handlePencilModeChange: () => void;
  isActive?: boolean;
};

export const PencilButton = ({
  handlePencilModeChange,
  isActive,
}: PencilButtonProps) => {
  const [open, setOpen] = useState(false);
  const [strokeKey, setStrokeKey] = useState<StrokeKey>("md");
  const setStrokeWith = useDrawingSettingsStore((state) => state.setStrokeWith);

  const handleStrokeChange = (key: StrokeKey, value: StrokeWidth) => {
    handlePencilModeChange();
    setStrokeWith(value);
    setStrokeKey(key);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onMouseEnter={() => setOpen(true)}
          onClick={() => {
            setOpen(true);
            handlePencilModeChange();
          }}
          size="icon"
          variant={isActive ? "boardActive" : "board"}
        >
          <Pencil />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex gap-1 w-auto p-[6px] shadow-none"
        side="right"
        sideOffset={6}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {Object.entries(strokeWidths).map(([key, value]) => {
          return (
            <Button
              variant={key === strokeKey ? "boardActive" : "board"}
              size="icon"
              onClick={() => handleStrokeChange(key as StrokeKey, value)}
              key={key}
            >
              {key}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
