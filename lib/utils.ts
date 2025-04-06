import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function devLog(name: string, value: unknown): void {
  if (process.env.NODE_ENV !== 'development') return;

  let output: string;

  if (typeof value === 'function') {
    output = '[Function: cannot stringify]';
  } else {
    try {
      output = JSON.stringify(value, null, 2);
    } catch {
      output = '[Unserializable value]';
    }
  }

  console.log(`🔍 ${name} ==>`, output);
}
