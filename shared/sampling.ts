import type { Room, Point } from "./types.js";
import { bbox, pointInPolygon, polygonArea } from "./geometry.js";
export function sampleRoom(room: Room, cell = 1): Point[] {
  if (!Number.isFinite(cell) || cell <= 0)
    throw new Error("Cell size must be positive");
  polygonArea(room.polygon);
  const box = bbox(room.polygon),
    points: Point[] = [];
  for (let x = box.minX + cell / 2; x < box.maxX; x += cell)
    for (let y = box.minY + cell / 2; y < box.maxY; y += cell) {
      const p = { x, y };
      if (pointInPolygon(p, room.polygon)) points.push(p);
    }
  return points;
}
