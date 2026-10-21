import type { DeviceRepository } from "./device-repository.js";
import type { Device } from "../../shared/types.js";
import { initialDevices } from "../seed/riverside-fa201.js";
export class InMemoryDeviceRepository implements DeviceRepository {
  private devices = new Map<string, Device[]>();
  private history = new Map<string, Device[][]>();
  constructor(seed: Device[] = initialDevices) {
    for (const id of new Set(seed.map((d) => d.sheetId)))
      this.devices.set(
        id,
        structuredClone(seed.filter((d) => d.sheetId === id)),
      );
  }
  getDevices(id: string) {
    return structuredClone(this.devices.get(id) ?? []);
  }
  save(id: string, devices: Device[]) {
    if (JSON.stringify(devices) === JSON.stringify(this.getDevices(id))) return;
    const stack = this.history.get(id) ?? [];
    stack.push(this.getDevices(id));
    this.history.set(id, stack);
    this.devices.set(id, structuredClone(devices));
  }
  undo(id: string) {
    const previous = this.history.get(id)?.pop();
    if (!previous) return null;
    this.devices.set(id, previous);
    return this.getDevices(id);
  }
  canUndo(id: string) {
    return Boolean(this.history.get(id)?.length);
  }
}
