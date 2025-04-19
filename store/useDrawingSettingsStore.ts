import { create } from "zustand";

import { strokeWidths } from "@/constants/canvasConstants";
import { StrokeWidth } from "@/types/canvas.types";

type DrawingSettingsStoreState = {
  strokeWith: StrokeWidth;
  setStrokeWith: (value: StrokeWidth) => void;
};

export const useDrawingSettingsStore = create<DrawingSettingsStoreState>(
  (set) => ({
    strokeWith: strokeWidths["md"],
    setStrokeWith: (value) => set({ strokeWith: value }),
  })
);
