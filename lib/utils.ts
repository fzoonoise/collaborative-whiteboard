import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Camera, Color } from "@/types/canvas.types";

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

  const type = typeof value;
  const date = new Date();
  date.setMinutes(date.getUTCMinutes());

  const [hours, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ].map((unit) => String(unit).padStart(2, "0"));

  const timeStamp = `[${hours}:${minutes}:${seconds}]`;
  const nameStyle = "font-weight: bold; color: #7BC96F	"; // Soft green, good in dark/light
  const valueStyle = "color: white;";
  const metaStyle = "color: #94A3B8	"; // Graphite Gray

  const isCollapsible = value !== null && typeof value === "object";

  if (isCollapsible) {
    console.groupCollapsed(
      `%c🔍 ${name} %c| Type: ${type} ${timeStamp} ==`,
      nameStyle,
      metaStyle
    );
    console.log(`%c${output}`, valueStyle);
    console.groupEnd();
  } else {
    console.log(
      `%c🔍 ${name} ==> %c${value} %c| Type: ${type} ${timeStamp}`,
      nameStyle,
      valueStyle,
      metaStyle
    );
  }
}

