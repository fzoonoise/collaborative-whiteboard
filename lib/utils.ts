import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Camera, Color } from "@/types/canvas.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UserColors = [
  "#DC2626",
  "#D97706", 
  "#059669",
  "#7C3AED",
  "#DB2777",
  "#F87171",
  "#FBBF24",
  "#4B5563",
  "#6B7280",
  "#78350F",
];

export function connectionIdToColor(connectionId: number): string {
  // The connectionId is typically an incrementing integer assigned by the server.
  return UserColors[connectionId % UserColors.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX - camera.x),
    y: Math.round(e.clientY - camera.y),
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function devLog(name: string, value: unknown): void {
  if (process.env.NODE_ENV !== "development") return;

  let output: string;

  if (typeof value === "function") {
    output = "[Function: cannot stringify]";
  } else {
    try {
      output = JSON.stringify(value, null, 2);
    } catch {
      output = "[Unserializable value]";
    }
  }

  console.log(`🔍 ${name} ==>`, output);
}
