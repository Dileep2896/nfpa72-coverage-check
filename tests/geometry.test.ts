import { describe, it, expect } from "vitest";
import {
  pointInPolygon,
  segmentInsidePolygon,
  distToSegment,
  polygonArea,
  centroid,
} from "../shared/geometry.js";
import { rectangle, lRoom } from "./fixtures.js";
describe("polygon geometry", () => {
  it("strictly excludes edges and outside points", () => {
    expect(pointInPolygon({ x: 2, y: 2 }, rectangle().polygon)).toBe(true);
    expect(pointInPolygon({ x: 0, y: 2 }, rectangle().polygon)).toBe(false);
    expect(pointInPolygon({ x: 31, y: 2 }, rectangle().polygon)).toBe(false);
    expect(pointInPolygon({ x: 24, y: 20 }, lRoom.polygon)).toBe(false);
  });
  it("blocks a sightline across a concave notch", () => {
    expect(
      segmentInsidePolygon({ x: 28, y: 10 }, { x: 14, y: 22 }, lRoom.polygon),
    ).toBe(false);
    expect(
      segmentInsidePolygon({ x: 5, y: 5 }, { x: 5, y: 22 }, lRoom.polygon),
    ).toBe(true);
  });
  it("handles short edges and exact area and centroid", () => {
    expect(
      distToSegment({ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 0, y: 0 }),
    ).toBeCloseTo(Math.sqrt(2));
    expect(polygonArea(lRoom.polygon)).toBe(552);
    expect(centroid(rectangle().polygon)).toEqual({ x: 15, y: 12 });
  });
  it("rejects degenerate polygons", () =>
    expect(() =>
      polygonArea([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ]),
    ).toThrow());
});
