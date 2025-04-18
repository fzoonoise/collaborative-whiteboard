"use client";

import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import {
  calculateScaledFontSize,
  cn,
  colorToCss,
  getContrastingTextColor,
} from "@/lib/utils";
import { NoteLayer } from "@/types/canvas.types";
import { useMutation } from "@/liveblocks.config";
import { LayerPreviewProps } from "./LayerPreview";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

type NoteProps = LayerPreviewProps & {
  layer: NoteLayer;
};

export const Note = ({
  id,
  layer,
  handleLayerPointerDown,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateLayerValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateLayerValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => handleLayerPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center outline-none",
          font.className
        )}
        style={{
          fontSize: calculateScaledFontSize(width, height, 0.15),
          color: fill ? getContrastingTextColor(fill) : "#fff",
        }}
      />
    </foreignObject>
  );
};
