import type { Point, Polygon } from "./types.js";
const EPS = 1e-8;
export const distance = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y);
export function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    den = dx * dx + dy * dy;
  const t =
    den === 0
      ? 0
      : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / den));
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}
export function polygonArea(poly: Polygon): number {
  const area =
    Math.abs(
      poly.reduce((s, p, i) => {
        const q = poly[(i + 1) % poly.length];
        return s + p.x * q.y - q.x * p.y;
      }, 0),
    ) / 2;
  if (poly.length < 3 || !Number.isFinite(area) || area < EPS)
    throw new Error("A room needs a non-degenerate polygon");
  return area;
}
export function pointInPolygon(p: Point, poly: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j],
      b = poly[i];
    if (distToSegment(p, a, b) < EPS) return false;
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    )
      inside = !inside;
  }
  return inside;
}
export function wallClearance(p: Point, poly: Polygon): number {
  return Math.min(
    ...poly.map((a, i) => distToSegment(p, a, poly[(i + 1) % poly.length])),
  );
}
/** Partition the sightline at every wall intersection; check each open interval.
 * Unlike fixed-step ray sampling, this cannot skip a narrow concave notch. */
export function segmentInsidePolygon(
  a: Point,
  b: Point,
  poly: Polygon,
): boolean {
  if (!pointInPolygon(a, poly) || !pointInPolygon(b, poly)) return false;
  const dx = b.x - a.x,
    dy = b.y - a.y,
    ts = [0, 1];
  for (let i = 0; i < poly.length; i++) {
    const c = poly[i],
      d = poly[(i + 1) % poly.length],
      ex = d.x - c.x,
      ey = d.y - c.y;
    const cross = dx * ey - dy * ex;
    if (Math.abs(cross) < EPS) continue;
    const t = ((c.x - a.x) * ey - (c.y - a.y) * ex) / cross;
    const u = ((c.x - a.x) * dy - (c.y - a.y) * dx) / cross;
    if (t > EPS && t < 1 - EPS && u >= -EPS && u <= 1 + EPS) ts.push(t);
  }
  ts.sort((x, y) => x - y);
  for (let i = 1; i < ts.length; i++) {
    if (ts[i] - ts[i - 1] < EPS) continue;
    const t = (ts[i] + ts[i - 1]) / 2;
    if (!pointInPolygon({ x: a.x + dx * t, y: a.y + dy * t }, poly))
      return false;
  }
  return true;
}
export function bbox(poly: Polygon) {
  return {
    minX: Math.min(...poly.map((p) => p.x)),
    minY: Math.min(...poly.map((p) => p.y)),
    maxX: Math.max(...poly.map((p) => p.x)),
    maxY: Math.max(...poly.map((p) => p.y)),
  };
}
export function centroid(poly: Polygon): Point {
  polygonArea(poly);
  let crossSum = 0,
    x = 0,
    y = 0;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length],
      cross = a.x * b.y - b.x * a.y;
    crossSum += cross;
    x += (a.x + b.x) * cross;
    y += (a.y + b.y) * cross;
  });
  return { x: x / (3 * crossSum), y: y / (3 * crossSum) };
}
