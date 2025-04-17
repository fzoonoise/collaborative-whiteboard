import { useSelf, useStorage } from "@/liveblocks.config";
import { shallow } from "@liveblocks/react";
import type { Layer, Rect } from "@/types/canvas.types";

// Calculates the smallest rectangle that completely encloses all selected layers.
const boundingBox = (layers: Layer[]): Rect | null => {
  const firstLayer = layers[0];

  if (!firstLayer) return null;

  let left = firstLayer.x;
  let right = firstLayer.x + firstLayer.width;
  let top = firstLayer.y;
  let bottom = firstLayer.y + firstLayer.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBounds = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useStorage(
    (root) => {
      const selectedLayers = selection
        .map((layerId) => root.layers.get(layerId)!)
        .filter(Boolean);

      return boundingBox(selectedLayers);
    },
    // Use shallow comparison to avoid unnecessary re-renders
    // when the returned object shape is the same.
    shallow
  );
};
