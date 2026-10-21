import { Router } from "express";
import { z } from "zod";
import type { LayoutProvider } from "../providers/layout-provider.js";
import type { DeviceRepository } from "../repo/device-repository.js";
import type { Device, Sheet } from "../../shared/types.js";
import { checkSheet } from "../../shared/check.js";
import { autoFix } from "../../shared/autofix.js";
import { buildBom, diffBom } from "../../shared/bom.js";
import { catalog } from "../seed/riverside-fa201.js";
const empty = z.object({}).strict();
const fixBody = z
  .object({ roomIds: z.array(z.string().min(1)).max(100).optional() })
  .strict();
export function sheetsRouter(provider: LayoutProvider, repo: DeviceRepository) {
  const router = Router();
  router.param("id", (req, res, next, id: string) => {
    provider
      .getSheet(id)
      .then((sheet) => {
        res.locals.sheet = sheet;
        next();
      })
      .catch(() => res.status(404).json({ error: "Sheet not found" }));
  });
  router.get("/:id", (_req, res) => res.json(res.locals.sheet));
  router.get("/:id/devices", (req, res) =>
    res.json({
      devices: repo.getDevices(req.params.id),
      canUndo: repo.canUndo(req.params.id),
    }),
  );
  router.get("/:id/bom", (req, res) =>
    res.json(buildBom(repo.getDevices(req.params.id), catalog)),
  );
  router.post("/:id/check", (req, res) => {
    empty.parse(req.body ?? {});
    res.json(checkSheet(res.locals.sheet, repo.getDevices(req.params.id)));
  });
  router.post("/:id/autofix", (req, res) => {
    const body = fixBody.parse(req.body ?? {}),
      sheet: Sheet = res.locals.sheet;
    if (body.roomIds?.some((id) => !sheet.rooms.some((r) => r.id === id)))
      return res.status(400).json({ error: "Unknown room ID" });
    let devices = repo.getDevices(req.params.id);
    const before = buildBom(devices, catalog),
      added: Device[] = [],
      moved: Device[] = [],
      swapped: Device[] = [];
    for (const room of sheet.rooms.filter(
      (r) => !body.roomIds || body.roomIds.includes(r.id),
    )) {
      const result = autoFix(room, devices);
      devices = result.devices;
      added.push(...result.added);
      moved.push(...result.moved);
      swapped.push(...result.swapped);
    }
    repo.save(req.params.id, devices);
    const bom = buildBom(devices, catalog);
    return res.json({
      devices,
      added,
      moved,
      swapped,
      report: checkSheet(sheet, devices),
      bom,
      bomDiff: diffBom(before, bom),
      canUndo: repo.canUndo(req.params.id),
    });
  });
  router.post("/:id/undo", (req, res) => {
    empty.parse(req.body ?? {});
    const before = buildBom(repo.getDevices(req.params.id), catalog),
      devices = repo.undo(req.params.id);
    if (!devices) return res.status(409).json({ error: "No changes to undo" });
    const bom = buildBom(devices, catalog);
    return res.json({
      devices,
      added: [],
      moved: [],
      swapped: [],
      report: checkSheet(res.locals.sheet, devices),
      bom,
      bomDiff: diffBom(before, bom),
      canUndo: repo.canUndo(req.params.id),
    });
  });
  return router;
}
