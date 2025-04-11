import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UserColors = [
  "#006400",
  "#ADFF2F",
  "#808080",
  "#E9967A",
  "#FFDEAD",
  "#00BFFF",
  "#FF4500",
  "#008080",
  "#808000",
  "#9ACD32",
];

export function connectionIdToColor(connectionId: number): string {
  // The connectionId is typically an incrementing integer assigned by the server.
  return UserColors[connectionId % UserColors.length];
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
