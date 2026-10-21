import type { Sheet, Device } from "../../shared/types.js";
export interface LayoutProvider {
  getSheet(sheetId: string): Promise<Sheet>;
  getAiFirstPass(sheetId: string): Promise<Device[]>;
}
