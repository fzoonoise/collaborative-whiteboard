"use client";

import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas.types";
import { LayerPreviewProps } from "./LayerPreview";

type EllipseProps = LayerPreviewProps & {
  layer: EllipseLayer;
};

export const Ellipse = ({
  id,
  layer,
  handleLayerPointerDown,
  selectionColor,
}: EllipseProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => handleLayerPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      fill={fill ? colorToCss(fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth={1}
    />
  );
};
