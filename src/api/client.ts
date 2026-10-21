import type {
  Sheet,
  Device,
  SheetReport,
  Bom,
  FixResponse,
} from "../../shared/types";
const base = "/api/sheets/FA-201";
async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(
    `${base}${path}`,
    body === undefined
      ? undefined
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
  );
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "The local API is unavailable" }));
    throw new Error(error.error ?? "Request failed");
  }
  return response.json();
}
export const api = {
  async load() {
    const [sheet, result, bom, report] = await Promise.all([
      request<Sheet>(""),
      request<{ devices: Device[]; canUndo: boolean }>("/devices"),
      request<Bom>("/bom"),
      request<SheetReport>("/check", {}),
    ]);
    return { sheet, ...result, bom, report };
  },
  check: () => request<SheetReport>("/check", {}),
  fix: (roomIds?: string[]) =>
    request<FixResponse>("/autofix", roomIds ? { roomIds } : {}),
  undo: () => request<FixResponse>("/undo", {}),
};
