"use client";

import { memo } from "react";
import { MousePointer2 } from "lucide-react";

import { useOther } from "@/liveblocks.config";
import { connectionIdToColor } from "@/lib/utils";

type CursorProps = {
  connectionId: number;
};

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  const name = info?.name || "Anonymous";
  const userColor = connectionIdToColor(connectionId);

  if (!cursor) return null;

  const { x, y } = cursor;

  return (
    <foreignObject
      className="relative drop-shadow-md"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      height={50}
      width={3 * 15 + 24}
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: userColor,
          color: userColor,
        }}
      />
      <span
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold whitespace-nowrap"
        style={{ backgroundColor: userColor }}
      >
        {name}
      </span>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
