import { it, expect } from "vitest";
import { sampleRoom } from "../shared/sampling.js";
import { pointInPolygon } from "../shared/geometry.js";
import { rectangle, lRoom } from "./fixtures.js";
it("samples cell centres, exactly the area of integer rooms", () => {
  const points = sampleRoom(rectangle());
  expect(points).toHaveLength(720);
  expect(points[0]).toEqual({ x: 0.5, y: 0.5 });
  expect(sampleRoom(lRoom)).toHaveLength(552);
  expect(sampleRoom(lRoom).every((p) => pointInPolygon(p, lRoom.polygon))).toBe(
    true,
  );
});
it("supports other cell sizes and rejects invalid grids", () => {
  expect(sampleRoom(rectangle(), 2)).toHaveLength(180);
  expect(() => sampleRoom(rectangle(), 0)).toThrow();
});
it("returns no points when a valid polygon contains no cell centres", () =>
  expect(sampleRoom(rectangle(0.25, 0.25))).toEqual([]));
