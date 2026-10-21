import type { Device, CatalogItem, Bom, BomDiff } from "./types.js";
const money = (n: number) => Math.round(n * 100) / 100;
export function buildBom(devices: Device[], catalog: CatalogItem[]): Bom {
  const quantities = new Map<string, number>();
  for (const d of devices)
    quantities.set(d.sku, (quantities.get(d.sku) ?? 0) + 1);
  if (devices.length) quantities.set("BASE-STD", devices.length);
  const lines = Array.from(quantities, ([sku, qty]) => {
    const item = catalog.find((c) => c.sku === sku);
    if (!item) throw new Error(`Unknown catalog SKU: ${sku}`);
    return {
      sku,
      description: item.description,
      qty,
      unitPrice: item.unitPrice,
      extended: money(qty * item.unitPrice),
      laborHours: money(qty * item.laborHours),
    };
  });
  return {
    lines,
    totals: {
      materials: money(lines.reduce((sum, l) => sum + l.extended, 0)),
      laborHours: money(lines.reduce((sum, l) => sum + l.laborHours, 0)),
      devices: devices.length,
    },
  };
}
export function diffBom(before: Bom, after: Bom): BomDiff[] {
  return [...new Set([...before.lines, ...after.lines].map((l) => l.sku))]
    .map((sku) => ({
      sku,
      before: before.lines.find((l) => l.sku === sku)?.qty ?? 0,
      after: after.lines.find((l) => l.sku === sku)?.qty ?? 0,
    }))
    .filter((l) => l.before !== l.after);
}
