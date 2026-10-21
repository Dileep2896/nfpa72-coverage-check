import { it, expect } from "vitest";
import { autoFix } from "../shared/autofix.js";
import { checkSheet, checkRoom } from "../shared/check.js";
import { wallClearance } from "../shared/geometry.js";
import { sheet, initialDevices } from "../server/seed/riverside-fa201.js";
import { rectangle, detector } from "./fixtures.js";
it("deterministically fixes the seed, without adding more than eight detectors", () => {
  let devices = structuredClone(initialDevices);
  for (const room of sheet.rooms) {
    const result = autoFix(room, devices);
    expect(result).toEqual(autoFix(room, devices));
    expect(result.added.length).toBeLessThanOrEqual(12);
    for (const d of result.added)
      expect(wallClearance(d, room.polygon)).toBeGreaterThanOrEqual(1);
    devices = result.devices;
  }
  const report = checkSheet(sheet, devices);
  expect(report.summary.coveragePct).toBe(100);
  expect(report.summary.violationCount).toBe(0);
  expect(devices.length - initialDevices.length).toBeLessThanOrEqual(8);
});
it("moves wall devices and swaps incorrect smoke devices to heat", () => {
  const room = { ...rectangle(14, 12), heatOnly: true };
  const result = autoFix(room, [detector(2 / 12, 6)]);
  expect(result.moved).toHaveLength(1);
  expect(result.devices[0].type).toBe("heat");
  expect(wallClearance(result.devices[0], room.polygon)).toBeGreaterThanOrEqual(
    1,
  );
  expect(checkRoom(room, result.devices).violations).toEqual([]);
});
