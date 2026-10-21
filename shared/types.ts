import { z } from "zod";
export const PointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});
export type Point = z.infer<typeof PointSchema>;
export type Polygon = Point[];
export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  polygon: z.array(PointSchema).min(3),
  ceilingHeightFt: z.number().positive(),
  requiresDetection: z.boolean(),
  heatOnly: z.boolean().optional(),
  tag: z
    .enum([
      "corridor",
      "exam",
      "lobby",
      "mech",
      "storage",
      "office",
      "break",
      "waiting",
      "conference",
    ])
    .optional(),
});
export type Room = z.infer<typeof RoomSchema>;
export const SheetSchema = z.object({
  id: z.string(),
  project: z.string(),
  name: z.string(),
  widthFt: z.number().positive(),
  heightFt: z.number().positive(),
  rooms: z.array(RoomSchema),
});
export type Sheet = z.infer<typeof SheetSchema>;
export const DeviceSchema = z.object({
  id: z.string(),
  sheetId: z.string(),
  roomId: z.string().optional(),
  type: z.enum(["smoke", "heat"]),
  sku: z.string(),
  x: z.number().finite(),
  y: z.number().finite(),
  listedSpacingFt: z.number().positive(),
  source: z.enum(["ai", "manual", "autofix"]),
  createdAt: z.string().datetime(),
});
export type Device = z.infer<typeof DeviceSchema>;
export type DeviceType = Device["type"];
export interface CatalogItem {
  sku: string;
  description: string;
  type: DeviceType | "base";
  listedSpacingFt: number;
  unitPrice: number;
  laborHours: number;
}
export interface Violation {
  kind: "COVERAGE_GAP" | "NO_DETECTOR" | "WALL_CLEARANCE" | "WRONG_TYPE";
  roomId: string;
  deviceId?: string;
  ruleRef: string;
  message: string;
  maxGapFt?: number | null;
  areaFt2?: number;
}
export interface RoomReport {
  roomId: string;
  samples: number;
  covered: number;
  coveragePct: number;
  uncovered: Point[];
  violations: Violation[];
}
export interface SheetReport {
  rooms: RoomReport[];
  summary: {
    coveragePct: number;
    roomsPassing: number;
    roomsFailing: number;
    violationCount: number;
  };
}
export interface BomLine {
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  extended: number;
  laborHours: number;
}
export interface Bom {
  lines: BomLine[];
  totals: { materials: number; laborHours: number; devices: number };
}
export interface BomDiff {
  sku: string;
  before: number;
  after: number;
}
export interface FixResult {
  devices: Device[];
  added: Device[];
  moved: Device[];
  swapped: Device[];
}
export interface FixResponse extends FixResult {
  report: SheetReport;
  bom: Bom;
  bomDiff: BomDiff[];
  canUndo: boolean;
}
