import { Layer, Point, Rect, Side } from "@/types/canvas.types";

export function calcResizeBounds(
  bounds: Rect,
  corner: Side,
  point: Point
): Rect {
  const result = { ...bounds };

  // Bitwise AND is used to check if a specific side flag (e.g. Left, Top) is set in the corner value.
  // Each side is a bit flag (1, 2, 4, 8), so we can combine them (e.g. Left | Top = 5), and use & to test inclusion.
  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(bounds.x + bounds.width, point.x);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(bounds.x, point.x);
    result.width = Math.abs(bounds.x - point.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(bounds.y + bounds.height, point.y);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(bounds.y, point.y);
    result.height = Math.abs(bounds.y - point.y);
  }

  return result;
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  origin: Point,
  current: Point
) {
  const rect = {
    x: Math.min(origin.x, current.x),
    y: Math.min(origin.y, current.y),
    width: Math.abs(origin.x - current.x),
    height: Math.abs(origin.y - current.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    // Use == to check both null and undefined,
    // but avoid !layer to prevent skipping valid falsy objects
    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    // Check if the layer and selection rectangle intersect
    // This uses AABB (Axis-Aligned Bounding Box) collision logic
    // Advantage:
    // - More user-friendly: layers are selected even if partially covered
    // - Matches common UX patterns in design tools (e.g., Figma, Photoshop)
    // - Efficient: O(1) per layer, minimal performance impact
    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
}
