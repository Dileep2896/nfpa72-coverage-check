import {
  sheet,
  initialDevices,
  catalog,
} from "../../../server/seed/riverside-fa201";
import { checkSheet } from "../../../shared/check";
import { autoFix } from "../../../shared/autofix";
import { buildBom } from "../../../shared/bom";
export { sheet, initialDevices };
export const before = checkSheet(sheet, initialDevices);
export const fixedDevices = sheet.rooms.reduce(
  (devices, room) => autoFix(room, devices).devices,
  initialDevices,
);
export const after = checkSheet(sheet, fixedDevices);
export const addedCount = fixedDevices.length - initialDevices.length;
export const bomDelta =
  buildBom(fixedDevices, catalog).totals.materials -
  buildBom(initialDevices, catalog).totals.materials;
