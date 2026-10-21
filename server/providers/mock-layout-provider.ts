import type { LayoutProvider } from "./layout-provider.js";
import { sheet, initialDevices } from "../seed/riverside-fa201.js";
/** Replace this adapter with a real AI placement service; keep credentials server-side. */
export class MockLayoutProvider implements LayoutProvider {
  async getSheet(id: string) {
    if (id !== sheet.id) throw new Error("Sheet not found");
    return structuredClone(sheet);
  }
  async getAiFirstPass(id: string) {
    await this.getSheet(id);
    return structuredClone(initialDevices);
  }
}
