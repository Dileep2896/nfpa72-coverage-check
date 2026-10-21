import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, TriangleAlert } from "lucide-react";
import type { Sheet, SheetReport } from "../../../shared/types";
export function RoomList({
  sheet,
  report,
  selected,
  onSelect,
}: {
  sheet: Sheet;
  report: SheetReport;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const rooms = report.rooms
    .filter((r) => r.violations.length)
    .sort(
      (a, b) =>
        b.uncovered.length - a.uncovered.length ||
        a.roomId.localeCompare(b.roomId),
    );
  return (
    <div className="room-list">
      <AnimatePresence>
        {rooms.map((r) => (
          <motion.button
            layout={!reduced}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            key={r.roomId}
            className={`room-row ${selected === r.roomId ? "active" : ""}`}
            onClick={() => onSelect(r.roomId)}
            aria-label={`${sheet.rooms.find((room) => room.id === r.roomId)?.name} ${Math.round(r.coveragePct)}% coverage`}
            aria-pressed={selected === r.roomId}
          >
            <span className="room-status">
              <TriangleAlert size={15} />
            </span>
            <span className="room-row-text">
              <strong>
                {sheet.rooms.find((room) => room.id === r.roomId)?.name}
              </strong>
              <small>
                {r.uncovered.length
                  ? `${r.uncovered.length} ft² uncovered`
                  : "Wall clearance"}
              </small>
            </span>
            <span className="room-percent">
              {Math.round(r.coveragePct)}
              <small>%</small>
            </span>
            <ChevronRight size={14} />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
