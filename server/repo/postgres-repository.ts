import type { DeviceRepository } from "./device-repository.js";
import type { Device } from "../../shared/types.js";
/** Integration stub only. To use DATABASE_URL, implement async SQL transactions,
 * evolve DeviceRepository methods to Promise results, and inject it in createApp.
 * Apply db/schema.sql; lock sheet FOR UPDATE and persist device_events snapshots.
 * Never silently use an in-memory fallback when persistence is requested. */
export class PostgresDeviceRepository implements DeviceRepository {
  getDevices(_id: string): Device[] {
    throw new Error("Postgres adapter is not configured");
  }
  save(_id: string, _devices: Device[]): void {
    throw new Error("Postgres adapter is not configured");
  }
  undo(_id: string): Device[] | null {
    throw new Error("Postgres adapter is not configured");
  }
  canUndo(_id: string): boolean {
    throw new Error("Postgres adapter is not configured");
  }
}
