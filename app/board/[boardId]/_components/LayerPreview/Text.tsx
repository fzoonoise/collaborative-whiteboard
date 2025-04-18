"use client";

import { Kalam } from "next/font/google";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import { useMutation } from "@/liveblocks.config";
import { TextLayer } from "@/types/canvas.types";
import { calculateScaledFontSize, cn, colorToCss } from "@/lib/utils";
import { LayerPreviewProps } from "./LayerPreview";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

type TextProps = LayerPreviewProps & {
  layer: TextLayer;
};

export const Text = ({
  id,
  layer,
  handleLayerPointerDown,
  selectionColor,
}: TextProps) => {
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
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calculateScaledFontSize(width, height, 0.5),
          color: fill ? colorToCss(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
