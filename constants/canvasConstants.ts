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

export const strokeWidths = {
  xs: 8, 
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;