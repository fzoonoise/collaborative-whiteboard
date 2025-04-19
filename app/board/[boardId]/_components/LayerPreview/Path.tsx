"use client";

import getStroke from "perfect-freehand";

type PathProps = {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  stroke?: string;
  handleLayerPointerDown?: (e: React.PointerEvent) => void;
};

function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export const Path = ({
  x,
  y,
  points,
  fill,
  stroke,
  handleLayerPointerDown,
}: PathProps) => {
  return (
    <path
      className="drop-shadow-md"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      onPointerDown={handleLayerPointerDown}
      x={0}
      y={0}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 12,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
