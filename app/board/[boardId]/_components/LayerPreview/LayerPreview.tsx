"use client";

import { memo } from "react";

import { useStorage } from "@/liveblocks.config";
import { layerType } from "@/constants/canvasConstants";

import { Rectangle } from "./Rectangle";

type LayerPreviewProps = {
  id: string;
  handleLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerPreview = memo(
  ({ id, handleLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    
    if (!layer) return null;

    switch (layer.type) {
      case layerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            handleLayerPointerDown={handleLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      default:
        console.warn("Unsupported layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
