import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas.types";

type RectangleProps = {
  id: string;
  layer: RectangleLayer;
  handleLayerPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export const Rectangle = ({
  id,
  layer,
  handleLayerPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => {
        handleLayerPointerDown(e, id);
      }}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: "absolute",
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : "#000"}
      stroke={selectionColor || "transparent"}
    />
  );
};
