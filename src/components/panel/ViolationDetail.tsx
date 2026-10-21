import { ArrowLeft, WandSparkles } from "lucide-react";
import type { Room, RoomReport } from "../../../shared/types";
export function ViolationDetail({
  room,
  report,
  onBack,
  onFix,
  busy,
}: {
  room: Room;
  report: RoomReport;
  onBack: () => void;
  onFix: () => void;
  busy: boolean;
}) {
  return (
    <div className="violation-detail">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={14} /> All rooms
      </button>
      <h3>{room.name}</h3>
      {report.violations.length ? (
        report.violations.map((v, i) => (
          <div className="violation" key={`${v.kind}-${i}`}>
            <strong>{v.kind.replaceAll("_", " ").toLowerCase()}</strong>
            <p>{v.message}</p>
            <code>{v.ruleRef}</code>
          </div>
        ))
      ) : (
        <p className="success-text">This room passes all configured checks.</p>
      )}
      <button
        className="button secondary wide"
        onClick={onFix}
        disabled={busy || !report.violations.length}
      >
        <WandSparkles size={15} />
        Auto-fix room
      </button>
    </div>
  );
}
