import type {
  Point,
  Device,
  Room,
  RoomReport,
  Sheet,
  SheetReport,
  Violation,
} from "./types.js";
import {
  distance,
  pointInPolygon,
  segmentInsidePolygon,
  wallClearance,
  polygonArea,
} from "./geometry.js";
import { sampleRoom } from "./sampling.js";
import {
  RADIUS_FACTOR,
  WALL_MIN_FT,
  COVERAGE_RULE,
  WALL_RULE,
  TYPE_RULE,
} from "./rules.js";
export const devicesInRoom = (room: Room, devices: Device[]) =>
  devices.filter(
    (d) =>
      (d.roomId === undefined || d.roomId === room.id) &&
      pointInPolygon(d, room.polygon),
  );
export function isCovered(
  point: Point,
  detectors: Device[],
  room: Room,
): boolean {
  return detectors.some(
    (d) =>
      (d.roomId === undefined || d.roomId === room.id) &&
      distance(point, d) <= RADIUS_FACTOR * d.listedSpacingFt + 1e-8 &&
      segmentInsidePolygon(d, point, room.polygon),
  );
}
export function checkRoom(room: Room, devices: Device[]): RoomReport {
  const samples = sampleRoom(room),
    local = devicesInRoom(room, devices);
  const uncovered = room.requiresDetection
    ? samples.filter((p) => !isCovered(p, local, room))
    : [];
  const covered = samples.length - uncovered.length,
    coveragePct = samples.length ? (100 * covered) / samples.length : 100;
  const violations: Violation[] = [];
  if (uncovered.length) {
    const maxGapFt = local.length
      ? Math.max(
          ...uncovered.map((p) =>
            Math.min(...local.map((d) => distance(p, d))),
          ),
        )
      : null;
    const areaFt2 =
      (polygonArea(room.polygon) * uncovered.length) / samples.length;
    violations.push({
      kind: "COVERAGE_GAP",
      roomId: room.id,
      ruleRef: COVERAGE_RULE,
      maxGapFt,
      areaFt2,
      message: `${Math.round(areaFt2)} ft² of ceiling is outside visible detector coverage.${maxGapFt === null ? " No detector is present." : ` Farthest gap: ${maxGapFt.toFixed(1)} ft; ${room.heatOnly ? "heat" : "smoke"} coverage radius: ${(RADIUS_FACTOR * Math.max(...local.map((d) => d.listedSpacingFt))).toFixed(1)} ft.`}`,
    });
  }
  if (room.requiresDetection && !local.length)
    violations.push({
      kind: "NO_DETECTOR",
      roomId: room.id,
      ruleRef: "Project detection schedule · required room",
      message:
        "This room requires detection but has no detector. Add a ceiling-mounted spot detector.",
    });
  for (const d of local) {
    const clearance = wallClearance(d, room.polygon);
    if (clearance < WALL_MIN_FT - 1e-8)
      violations.push({
        kind: "WALL_CLEARANCE",
        roomId: room.id,
        deviceId: d.id,
        ruleRef: WALL_RULE,
        message: `Detector is ${(clearance * 12).toFixed(1)} in from a sidewall. Review minimum 4 in clearance; auto-fix moves it to at least 1 ft.`,
      });
    if (room.heatOnly && d.type === "smoke")
      violations.push({
        kind: "WRONG_TYPE",
        roomId: room.id,
        deviceId: d.id,
        ruleRef: TYPE_RULE,
        message:
          "Smoke detector in a heat-only room. Swap to a fixed-temperature heat detector (HD-FT135).",
      });
  }
  return {
    roomId: room.id,
    samples: samples.length,
    covered,
    coveragePct,
    uncovered,
    violations,
  };
}
export function checkSheet(sheet: Sheet, devices: Device[]): SheetReport {
  const rooms = sheet.rooms.map((r) => checkRoom(r, devices));
  const required = sheet.rooms.filter((r) => r.requiresDetection),
    area = required.reduce((sum, r) => sum + polygonArea(r.polygon), 0);
  const coveragePct = area
    ? required.reduce(
        (sum, r) =>
          sum +
          polygonArea(r.polygon) *
            rooms.find((x) => x.roomId === r.id)!.coveragePct,
        0,
      ) / area
    : 100;
  const roomsFailing = rooms.filter((r) => r.violations.length).length;
  return {
    rooms,
    summary: {
      coveragePct,
      roomsPassing: rooms.length - roomsFailing,
      roomsFailing,
      violationCount: rooms.reduce((sum, r) => sum + r.violations.length, 0),
    },
  };
}
