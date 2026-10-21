import { it, expect } from "vitest";
import { buildBom, diffBom } from "../shared/bom.js";
import { catalog } from "../server/seed/riverside-fa201.js";
import { detector } from "./fixtures.js";
it("adds one base per detector and computes priced lines and labor", () => {
  const bom = buildBom([detector(), detector(5, 5, { id: "d2" })], catalog);
  expect(bom.lines.find((l) => l.sku === "BASE-STD")?.qty).toBe(2);
  expect(bom.totals.materials).toBe(116.6);
  expect(bom.totals.laborHours).toBe(1.5);
});
it("diffs changed quantities only", () => {
  expect(
    diffBom(buildBom([], catalog), buildBom([detector()], catalog)),
  ).toEqual([
    { sku: "SD-PH-2W", before: 0, after: 1 },
    { sku: "BASE-STD", before: 0, after: 1 },
  ]);
});
