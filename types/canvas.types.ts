import { canvasMode, layerType, strokeWidths } from "@/constants/canvasConstants";

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export type LayerType = keyof typeof layerType;

export type Point = {
  x: number;
  y: number;
};

export type Rect = Point & {
  width: number;
  height: number;
};

type LayerBase = Rect & {
  fill: Color;
  value?: string;
};

// Automatically map each layer type to a full layer definition
type LayerMap = {
  [L in LayerType]: LayerBase & { type: (typeof layerType)[L] };
};

export type RectangleLayer = LayerMap["Rectangle"];
export type EllipseLayer = LayerMap["Ellipse"];
export type PathLayer = LayerMap["Path"] & { points: number[][] ,strokeWidth:StrokeWidth};
export type TextLayer = LayerMap["Text"];
export type NoteLayer = LayerMap["Note"];

export type CanvasMode = keyof typeof canvasMode;

/**
 * Enum representing the four directional sides.
 * Each value is a distinct power of 2 to allow bitwise combination.
 * This enables efficient encoding of multiple directions in a single value
 * using bitwise operations (e.g., Top | Left = 5).
 */
export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: typeof canvasMode.None;
    }
  | {
      mode: typeof canvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: typeof canvasMode.Translating;
      current: Point;
    }
  | {
      mode: typeof canvasMode.Inserting;
      layerType:
        | typeof layerType.Ellipse
        | typeof layerType.Rectangle
        | typeof layerType.Text
        | typeof layerType.Note;
    }
  | {
      mode: typeof canvasMode.Pencil;
    }
  | {
      mode: typeof canvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: typeof canvasMode.Resizing;
      initialBounds: Rect;
      corner: Side;
    };

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;

export type StrokeKey = keyof typeof strokeWidths;
export type StrokeWidth = (typeof strokeWidths)[keyof typeof strokeWidths];
