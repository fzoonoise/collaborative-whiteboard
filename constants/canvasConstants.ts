export const canvasMode = {
  None: "None",
  SelectionNet: "SelectionNet",
  Translating: "Translating",
  Inserting: "Inserting",
  Pencil: "Pencil",
  Pressing: "Pressing",
  Resizing: "Resizing",
} as const;

export const layerType = {
  Rectangle: "Rectangle",
  Ellipse: "Ellipse",
  Path: "Path",
  Text: "Text",
  Note: "Note",
} as const;

export const side = {
  Top: 1,
  Bottom: 2,
  Left: 4,
  Right: 8,
} as const;
