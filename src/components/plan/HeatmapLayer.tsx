import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SheetReport, Device } from "../../../shared/types";
export function HeatmapLayer({
  report,
  devices,
}: {
  report: SheetReport;
  devices: Device[];
}) {
  const reduced = useReducedMotion(),
    added = devices.filter((d) => d.source === "autofix");
  return (
    <g className="heatmap" aria-hidden="true">
      <AnimatePresence>
        {report.rooms.flatMap((r) =>
          r.uncovered.map((p) => {
            const gap = added.length
              ? Math.min(...added.map((d) => Math.hypot(d.x - p.x, d.y - p.y)))
              : 0;
            return (
              <motion.rect
                key={`${r.roomId}-${p.x}-${p.y}`}
                x={p.x - 0.5}
                y={p.y - 0.5}
                width=".94"
                height=".94"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: reduced ? 0 : 0.3,
                    delay: reduced ? 0 : Math.min(gap * 0.008, 0.3),
                  },
                }}
                transition={{ duration: reduced ? 0 : 0.35 }}
              />
            );
          }),
        )}
      </AnimatePresence>
    </g>
  );
}
