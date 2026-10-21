import { it, expect } from "vitest";
import { checkRoom, checkSheet, isCovered } from "../shared/check.js";
import { rectangle, lRoom, detector } from "./fixtures.js";
import { sheet, initialDevices } from "../server/seed/riverside-fa201.js";
it("covers the conference corners and exact radius, only in the same room", () => {
  expect(checkRoom(rectangle(), [detector()]).coveragePct).toBe(100);
  expect(isCovered({ x: 29, y: 1 }, [detector(8, 1)], rectangle())).toBe(true);
  expect(
    isCovered(
      { x: 15, y: 12 },
      [detector(15, 12, { roomId: "other" })],
      rectangle(),
    ),
  ).toBe(false);
});
it("never sees through the L corner", () =>
  expect(isCovered({ x: 14, y: 22 }, [detector(28, 10)], lRoom)).toBe(false));
it("finds corridor gaps with a hand-computed farthest distance", () => {
  const report = checkRoom(rectangle(118, 8), [
    detector(20, 4),
    detector(98, 4, { id: "d2" }),
  ]);
  expect(
    report.violations.find((v) => v.kind === "COVERAGE_GAP")?.maxGapFt,
  ).toBeCloseTo(Math.hypot(38.5, 3.5), 1);
});
it("distinguishes 3.9 inches from 4.1 inches of wall clearance", () => {
  expect(
    checkRoom(rectangle(), [detector(3.9 / 12, 12)]).violations.some(
      (v) => v.kind === "WALL_CLEARANCE",
    ),
  ).toBe(true);
  expect(
    checkRoom(rectangle(), [detector(4.1 / 12, 12)]).violations.some(
      (v) => v.kind === "WALL_CLEARANCE",
    ),
  ).toBe(false);
});
it("reports missing detectors and wrong types with rule references", () => {
  expect(checkRoom(rectangle(), []).violations.map((v) => v.kind)).toContain(
    "NO_DETECTOR",
  );
  const wrong = checkRoom({ ...rectangle(), heatOnly: true }, [
    detector(),
  ]).violations.find((v) => v.kind === "WRONG_TYPE");
  expect(wrong?.message).toMatch(/heat/i);
  expect(wrong?.ruleRef).toBeTruthy();
  expect(
    checkRoom({ ...rectangle(), requiresDetection: false }, []).violations,
  ).toEqual([]);
});
it("pins the final seed summary", () => {
  const report = checkSheet(sheet, initialDevices);
  expect(report.summary.coveragePct).toBeCloseTo(87.24590163934427, 10);
  expect(report.summary).toMatchObject({
    roomsPassing: 13,
    roomsFailing: 5,
    violationCount: 6,
  });
  expect(report.summary.roomsFailing).toBe(5);
});
