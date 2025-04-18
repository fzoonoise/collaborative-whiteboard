"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas.types";

type ColorPickerProps = {
  handleFillChange: (color: Color) => void;
};

export const ColorPicker = ({ handleFillChange }: ColorPickerProps) => {
  return (
    <div className="grid grid-cols-4 gap-1 items-center">
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 243, g: 82, b: 35 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 255, g: 249, b: 177 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 68, g: 202, b: 99 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 39, g: 142, b: 237 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 155, g: 105, b: 245 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 252, g: 142, b: 42 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 0, g: 0, b: 0 }}
      />
      <ColorButton
        handleFillChange={handleFillChange}
        color={{ r: 255, g: 255, b: 255 }}
      />
    </div>
  );
};

type ColorButtonProps = {
  color: Color;
  handleFillChange: (color: Color) => void;
};

const ColorButton = ({ color, handleFillChange }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition shrink-0"
      onClick={() => handleFillChange(color)}
    >
      <div
        className="h-8 w-8 rounded-full border border-neutral-300"
        style={{ backgroundColor: colorToCss(color) }}
      />
    </button>
  );
};
