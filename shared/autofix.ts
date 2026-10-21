import type { Device, Room, Point, FixResult } from "./types.js";
import { bbox, pointInPolygon, wallClearance, distance } from "./geometry.js";
import { checkRoom, isCovered, devicesInRoom } from "./check.js";
import { AUTOFIX_WALL_FT, WALL_MIN_FT, LISTED_SPACING } from "./rules.js";
export function autoFix(room: Room, input: Device[]): FixResult {
  const devices = input.map((d) => ({ ...d })),
    added: Device[] = [],
    moved: Device[] = [],
    swapped: Device[] = [];
  const box = bbox(room.polygon),
    candidates: Point[] = [];
  for (let x = box.minX + 1; x <= box.maxX - 1; x += 2)
    for (let y = box.minY + 1; y <= box.maxY - 1; y += 2) {
      const p = { x, y };
      if (
        pointInPolygon(p, room.polygon) &&
        wallClearance(p, room.polygon) >= AUTOFIX_WALL_FT - 1e-8
      )
        candidates.push(p);
    }
  for (const d of devicesInRoom(room, devices)) {
    if (room.heatOnly && d.type === "smoke") {
      d.type = "heat";
      d.sku = "HD-FT135";
      d.listedSpacingFt = 50;
      swapped.push(d);
    }
    if (wallClearance(d, room.polygon) < WALL_MIN_FT) {
      const target = [...candidates].sort(
        (a, b) => distance(a, d) - distance(b, d) || a.x - b.x || a.y - b.y,
      )[0];
      if (target) {
        d.x = target.x;
        d.y = target.y;
        moved.push(d);
      }
    }
  }
  let uncovered = checkRoom(room, devices).uncovered;
  const type = room.heatOnly ? "heat" : "smoke";
  const template: Device = {
    id: "candidate",
    sheetId: input[0]?.sheetId ?? "FA-201",
    roomId: room.id,
    type,
    sku: type === "heat" ? "HD-FT135" : "SD-PH-2W",
    x: 0,
    y: 0,
    listedSpacingFt: LISTED_SPACING[type],
    source: "autofix",
    createdAt: input[0]?.createdAt ?? "2026-10-21T00:00:00.000Z",
  };
  // Cache visibility once; each greedy step only counts still-uncovered cells.
  const options = candidates.map((p) => ({
    p,
    covers: new Set(
      uncovered.filter((s) => isCovered(s, [{ ...template, ...p }], room)),
    ),
  }));
  for (let step = 0; step < 12 && uncovered.length; step++) {
    const center = {
      x: uncovered.reduce((s, p) => s + p.x, 0) / uncovered.length,
      y: uncovered.reduce((s, p) => s + p.y, 0) / uncovered.length,
    };
    const ranked = options
      .map((o) => ({
        ...o,
        count: uncovered.reduce((n, p) => n + Number(o.covers.has(p)), 0),
      }))
      .sort(
        (a, b) =>
          b.count - a.count ||
          distance(a.p, center) - distance(b.p, center) ||
          a.p.x - b.p.x ||
          a.p.y - b.p.y,
      );
    const best = ranked[0];
    if (!best?.count) break;
    let index = step + 1;
    while (devices.some((d) => d.id === `fix-${room.id}-${index}`)) index++;
    const d = { ...template, ...best.p, id: `fix-${room.id}-${index}` };
    devices.push(d);
    added.push(d);
    uncovered = uncovered.filter((p) => !best.covers.has(p));
  }
  return { devices, added, moved, swapped };
}
