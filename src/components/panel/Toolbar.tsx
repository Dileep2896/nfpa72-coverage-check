import { ScanLine, Undo2, Layers2 } from "lucide-react";
export function Toolbar({
  busy,
  canUndo,
  rings,
  setRings,
  heatmap,
  setHeatmap,
  onCheck,
  onUndo,
}: {
  busy: boolean;
  canUndo: boolean;
  rings: boolean;
  setRings: (v: boolean) => void;
  heatmap: boolean;
  setHeatmap: (v: boolean) => void;
  onCheck: () => void;
  onUndo: () => void;
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-context">
        <Layers2 size={17} />
        <strong>FA-201</strong>
        <span>Fire alarm plan</span>
        <span className="revision">Rev. A</span>
      </div>
      <div className="toolbar-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={heatmap}
            onChange={(e) => setHeatmap(e.target.checked)}
          />
          <span />
          Gaps
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={rings}
            onChange={(e) => setRings(e.target.checked)}
          />
          <span />
          Coverage rings
        </label>
        <div className="toolbar-divider" />
        <button
          className="button quiet"
          disabled={busy || !canUndo}
          onClick={onUndo}
        >
          <Undo2 size={16} />
          Undo
        </button>
        <button className="button primary" disabled={busy} onClick={onCheck}>
          <ScanLine size={16} />
          {busy ? "Checking…" : "Run code check"}
        </button>
      </div>
    </div>
  );
}
