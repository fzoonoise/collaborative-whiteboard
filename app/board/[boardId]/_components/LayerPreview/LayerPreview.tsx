"use client";

import { memo } from "react";

import { useStorage } from "@/liveblocks.config";
import { colorToCss } from "@/lib/utils";
import { layerType } from "@/constants/canvasConstants";

import { Text } from "./Text";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { Note } from "./Note";
import { Path } from "./Path";

export type LayerPreviewProps = {
  id: string;
  handleLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerPreview = memo(
  ({ id, handleLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    switch (layer.type) {
      case layerType.Text:
        return (
          <Text
            id={id}
            layer={layer}
            handleLayerPointerDown={handleLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case layerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            handleLayerPointerDown={handleLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case layerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            handleLayerPointerDown={handleLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case layerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            handleLayerPointerDown={handleLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case layerType.Path:
        return (
          <Path
            points={layer.points}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            stroke={selectionColor}
            handleLayerPointerDown={(e) => handleLayerPointerDown(e, id)}
          />
        );
      default:
        const exhaustiveCheck: never = layer;
        console.warn(
          "Unsupported layer type: %c%s",
          "color: white; font-weight: bold;",
          (layer as any).type 
        );
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
