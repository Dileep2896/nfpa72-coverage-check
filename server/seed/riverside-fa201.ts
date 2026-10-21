import type { Sheet, Room, Device, CatalogItem } from "../../shared/types.js";
import { pointInPolygon } from "../../shared/geometry.js";
function room(
  id: string,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  tag: Room["tag"],
  heatOnly = false,
): Room {
  return {
    id,
    name,
    polygon: [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ],
    ceilingHeightFt: 9,
    requiresDetection: true,
    tag,
    heatOnly,
  };
}
export const sheet: Sheet = {
  id: "FA-201",
  project: "Riverside Medical Center",
  name: "Floor 2 · Fire alarm plan",
  widthFt: 160,
  heightFt: 96,
  rooms: [
    room("lobby", "Lobby", 8, 8, 40, 30, "lobby"),
    room("east-corridor", "East corridor", 40, 40, 118, 8, "corridor"),
    room("north-corridor", "North corridor", 50, 8, 70, 8, "corridor"),
    ...Array.from({ length: 6 }, (_, i) =>
      room(`exam-${i + 1}`, `Exam ${i + 1}`, 52 + i * 16, 20, 12, 14, "exam"),
    ),
    room("nurse", "Nurse station", 52, 54, 20, 16, "office"),
    {
      ...room("waiting", "Waiting room", 8, 44, 30, 24, "waiting"),
      polygon: [
        { x: 8, y: 44 },
        { x: 38, y: 44 },
        { x: 38, y: 56 },
        { x: 24, y: 56 },
        { x: 24, y: 68 },
        { x: 8, y: 68 },
      ],
    },
    room("conference", "Conference", 78, 54, 30, 24, "conference"),
    room("storage", "Storage", 8, 76, 10, 8, "storage"),
    room("break", "Break room", 114, 54, 14, 12, "break", true),
    room("mechanical", "Mechanical", 134, 54, 16, 14, "mech", true),
    room("electrical", "Electrical", 22, 76, 6, 6, "mech"),
    room("office-1", "Office 1", 32, 76, 12, 12, "office"),
    room("office-2", "Office 2", 46, 76, 12, 12, "office"),
  ],
};
// The mock is deliberately editable vector data, not a call to a vision model.
const points: Array<[number, number, "smoke" | "heat"]> = [
  [16, 17, "smoke"],
  [19, 28, "smoke"],
  [60, 44, "smoke"],
  [138, 44, "smoke"],
  [67, 12, "smoke"],
  [103, 12, "smoke"],
  ...Array.from({ length: 6 }, (_, i): [number, number, "smoke"] => [
    58 + i * 16,
    27,
    "smoke",
  ]),
  [62, 62, "smoke"],
  [31, 50, "smoke"],
  [93, 66, "smoke"],
  [8 + 2 / 12, 80, "smoke"],
  [121, 60, "heat"],
  [142, 61, "heat"],
  [38, 82, "smoke"],
  [52, 82, "smoke"],
  [55, 25, "smoke"],
  [71, 25, "smoke"],
  [87, 25, "smoke"],
];
export const initialDevices: Device[] = points.map(([x, y, type], i) => ({
  id: `ai-${String(i + 1).padStart(2, "0")}`,
  sheetId: sheet.id,
  roomId: sheet.rooms.find((r) => pointInPolygon({ x, y }, r.polygon))?.id,
  type,
  sku: type === "smoke" ? "SD-PH-2W" : "HD-FT135",
  x,
  y,
  listedSpacingFt: type === "smoke" ? 30 : 50,
  source: "ai",
  createdAt: "2026-10-21T09:00:00.000Z",
}));
export const catalog: CatalogItem[] = [
  {
    sku: "SD-PH-2W",
    description: "Photoelectric smoke detector, 2-wire",
    type: "smoke",
    listedSpacingFt: 30,
    unitPrice: 48.5,
    laborHours: 0.75,
  },
  {
    sku: "HD-FT135",
    description: "Fixed-temp heat detector, 135°F",
    type: "heat",
    listedSpacingFt: 50,
    unitPrice: 31.2,
    laborHours: 0.6,
  },
  {
    sku: "BASE-STD",
    description: "Standard detector base",
    type: "base",
    listedSpacingFt: 0,
    unitPrice: 9.8,
    laborHours: 0,
  },
];
