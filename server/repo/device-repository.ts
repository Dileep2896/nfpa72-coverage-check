import type { Device } from "../../shared/types.js";
/** A transaction commits one whole-floor change and one undo snapshot atomically. */
export interface DeviceRepository {
  getDevices(sheetId: string): Device[];
  save(sheetId: string, devices: Device[]): void;
  undo(sheetId: string): Device[] | null;
  canUndo(sheetId: string): boolean;
}
