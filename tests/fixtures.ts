import type { Device, Room } from "../shared/types.js";
export const rectangle = (w = 30, h = 24): Room => ({
  id: "r",
  name: "Conference",
  polygon: [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ],
  ceilingHeightFt: 9,
  requiresDetection: true,
});
export const lRoom: Room = {
  ...rectangle(),
  name: "Waiting",
  polygon: [
    { x: 0, y: 0 },
    { x: 30, y: 0 },
    { x: 30, y: 12 },
    { x: 16, y: 12 },
    { x: 16, y: 24 },
    { x: 0, y: 24 },
  ],
};
export const detector = (
  x = 15,
  y = 12,
  overrides: Partial<Device> = {},
): Device => ({
  id: "d1",
  sheetId: "FA-201",
  roomId: "r",
  type: "smoke",
  sku: "SD-PH-2W",
  x,
  y,
  listedSpacingFt: 30,
  source: "ai",
  createdAt: "2026-10-21T00:00:00.000Z",
  ...overrides,
});
