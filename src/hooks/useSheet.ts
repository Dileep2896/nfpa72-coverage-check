import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import type { BomDiff } from "../../shared/types";
export function useSheet() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.load>> | null>(
    null,
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [diff, setDiff] = useState<BomDiff[]>([]),
    [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setError("");
    try {
      setData(await api.load());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function action(kind: "fix" | "undo" | "check", roomIds?: string[]) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (kind === "check") {
        const report = await api.check();
        setData((d) => (d ? { ...d, report } : d));
        setMessage(
          `Check complete. ${report.summary.roomsFailing} rooms need attention.`,
        );
      } else {
        const result =
          kind === "fix" ? await api.fix(roomIds) : await api.undo();
        setData((d) => (d ? { ...d, ...result } : d));
        setDiff(result.bomDiff);
        setMessage(
          kind === "undo"
            ? "Previous layout restored."
            : `${result.added.length} detectors added, ${result.moved.length} moved. BOM updated.`,
        );
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return { data, busy, error, diff, message, load, action };
}
