import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronRight,
  FileCheck2,
  FileStack,
  ShieldCheck,
  CircleHelp,
  Plus,
  Minus,
  Maximize,
  Compass,
  WandSparkles,
  Check,
  LoaderCircle,
  Building2,
  ArrowLeft,
  CircleCheck,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PlanCanvas } from "../components/plan/PlanCanvas";
import { ScoreRing } from "../components/panel/ScoreRing";
import { RoomList } from "../components/panel/RoomList";
import { ViolationDetail } from "../components/panel/ViolationDetail";
import { BomTable } from "../components/panel/BomTable";
import { Toolbar } from "../components/panel/Toolbar";
import { useSheet } from "../hooks/useSheet";
export function PlanPage() {
  const { data, busy, error, diff, message, load, action } = useSheet();
  const [tab, setTab] = useState<"check" | "bom">("check"),
    [selected, setSelected] = useState<string | null>(null),
    [rings, setRings] = useState(true),
    [heatmap, setHeatmap] = useState(true),
    [zoom, setZoom] = useState(1);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setZoom(1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const complete = data?.report.summary.violationCount === 0;
  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />
        <div className="header-divider" />
        <div className="breadcrumbs">
          <span>Projects</span>
          <ChevronRight size={13} />
          <strong>Riverside Medical Center</strong>
          <span className="project-tag">RMC</span>
        </div>
        <Link className="story-link" to="/story">
          Behind the feature
          <ArrowUpRight size={14} />
        </Link>
        <div className="avatar" title="Local demo workspace">
          DS
        </div>
      </header>
      <div className="app-body">
        <nav className="side-rail" aria-label="Workspace">
          <Link className="rail-item" to="/" title="Project drawings">
            <FileStack size={21} />
          </Link>
          <a
            className="rail-item selected"
            href="#review-panel"
            title="Coverage check"
            aria-label="Coverage check"
          >
            <ShieldCheck size={22} />
          </a>
          <Link
            className="rail-item rail-bottom"
            to="/story"
            title="Feature explainer"
            aria-label="Feature explainer"
          >
            <CircleHelp size={21} />
          </Link>
        </nav>
        <main className="workspace">
          <div className="project-heading">
            <div>
              <div className="project-kicker">
                <Building2 size={13} />
                RIVERSIDE MEDICAL CENTER
              </div>
              <h1>A first pass. A clearer picture.</h1>
              <p>Verify detector coverage before your next submittal.</p>
            </div>
            <span className="local-status">
              <span />
              Local demo · AI first pass
            </span>
          </div>
          {error && (
            <div role="alert" className="error-banner">
              {error}{" "}
              <button onClick={() => void load()}>Retry connection</button>
            </div>
          )}
          {!data ? (
            <div className="loading-state">
              <LoaderCircle className="spin" />
              Loading drawing and device schedule…
            </div>
          ) : (
            <>
              <Toolbar
                busy={busy}
                canUndo={data.canUndo}
                rings={rings}
                setRings={setRings}
                heatmap={heatmap}
                setHeatmap={setHeatmap}
                onCheck={() => void action("check")}
                onUndo={() => void action("undo")}
              />
              <div className="workbench">
                <div className="drawing-column">
                  <div className="drawing-stage">
                    <div className="drawing-caption">
                      <span className="sheet-badge">FA-201</span>
                      <span>
                        LEVEL 02 <span className="caption-dot">/</span> FIRE
                        ALARM
                      </span>
                    </div>
                    {selected && (
                      <button
                        className="back-to-floor button"
                        onClick={() => setSelected(null)}
                      >
                        <ArrowLeft size={13} />
                        Full floor
                      </button>
                    )}
                    <PlanCanvas
                      sheet={data.sheet}
                      devices={data.devices}
                      report={data.report}
                      rings={rings}
                      heatmap={heatmap}
                      selected={selected}
                      onSelect={setSelected}
                      zoom={zoom}
                      allGreen={complete}
                    />
                    <div className="plan-north">
                      <Compass size={24} />
                      <span>N</span>
                    </div>
                    <div className="canvas-tools">
                      <button
                        aria-label="Zoom out"
                        disabled={zoom <= 0.7}
                        onClick={() => {
                          setSelected(null);
                          setZoom((z) => Math.max(0.7, z - 0.15));
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{Math.round(zoom * 100)}%</span>
                      <button
                        aria-label="Zoom in"
                        disabled={zoom >= 2}
                        onClick={() => {
                          setSelected(null);
                          setZoom((z) => Math.min(2, z + 0.15));
                        }}
                      >
                        <Plus size={16} />
                      </button>
                      <i />
                      <button
                        aria-label="Fit floor to view"
                        onClick={() => {
                          setSelected(null);
                          setZoom(1);
                        }}
                      >
                        <Maximize size={16} />
                      </button>
                    </div>
                    <div className="plan-scale">
                      <span />
                      <small>
                        0 <span>20 ft</span>
                      </small>
                    </div>
                  </div>
                  <div className="drawing-legend">
                    <span>
                      <i className="legend-ring" />
                      Detector coverage
                    </span>
                    <span>
                      <i className="legend-gap" />
                      Uncovered ceiling
                    </span>
                    <span>
                      <i className="legend-device">S</i>Smoke{" "}
                      <i className="legend-device">H</i>Heat
                    </span>
                    <span className="legend-total">
                      {data.devices.length} devices · {data.sheet.rooms.length}{" "}
                      rooms
                    </span>
                  </div>
                  <div className="drawing-info">
                    <FileCheck2 size={16} />
                    <span>
                      Ceiling plan · 1 ft sampling grid · Smooth ceilings ≤ 10
                      ft
                    </span>
                    <span className="mono">UNITS: FT</span>
                  </div>
                </div>
                <aside
                  className="review-panel"
                  id="review-panel"
                  aria-label="Coverage review"
                >
                  <div
                    className="panel-tabs"
                    role="tablist"
                    aria-label="Review panel"
                  >
                    <button
                      id="check-tab"
                      role="tab"
                      aria-selected={tab === "check"}
                      aria-controls="review-content"
                      onClick={() => setTab("check")}
                    >
                      <ShieldCheck size={16} />
                      Code check
                      {!complete && (
                        <span className="tab-count">
                          {data.report.summary.violationCount}
                        </span>
                      )}
                    </button>
                    <button
                      id="bom-tab"
                      role="tab"
                      aria-selected={tab === "bom"}
                      aria-controls="review-content"
                      onClick={() => setTab("bom")}
                    >
                      BOM{diff.length > 0 && <span className="change-dot" />}
                    </button>
                  </div>
                  <div className="score-section">
                    <ScoreRing score={data.report.summary.coveragePct} />
                    <div>
                      <span className="eyebrow">CEILING COVERAGE</span>
                      <h2>
                        {complete
                          ? "Every room covered."
                          : "A few gaps to close."}
                      </h2>
                      <p>
                        {data.report.summary.roomsPassing} of{" "}
                        {data.sheet.rooms.length} rooms pass
                      </p>
                    </div>
                  </div>
                  <div className="rule-summary">
                    <ShieldCheck size={15} />
                    <span>
                      NFPA 72 <span>·</span> Spot-type detection
                    </span>
                    <span className="rule-radius">0.7 × S</span>
                  </div>
                  <div
                    role="tabpanel"
                    id="review-content"
                    aria-labelledby={tab === "check" ? "check-tab" : "bom-tab"}
                    className="panel-content"
                  >
                    {tab === "bom" ? (
                      <BomTable bom={data.bom} diff={diff} />
                    ) : selected ? (
                      <ViolationDetail
                        room={data.sheet.rooms.find((r) => r.id === selected)!}
                        report={data.report.rooms.find(
                          (r) => r.roomId === selected,
                        )!}
                        onBack={() => setSelected(null)}
                        onFix={() => void action("fix", [selected])}
                        busy={busy}
                      />
                    ) : complete ? (
                      <div className="all-pass">
                        <div>
                          <CircleCheck size={32} />
                        </div>
                        <h3>All rooms pass.</h3>
                        <p>Ready for submittal.</p>
                        <small>
                          All configured checks pass for this layout. A
                          qualified designer completes the final review.
                        </small>
                        <button
                          className="text-button"
                          onClick={() => setTab("bom")}
                        >
                          Review updated BOM <ChevronRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="panel-section-heading">
                          <h3>Needs attention</h3>
                          <span>{data.report.summary.roomsFailing} rooms</span>
                        </div>
                        <RoomList
                          sheet={data.sheet}
                          report={data.report}
                          selected={selected}
                          onSelect={setSelected}
                        />
                        <p className="list-hint">
                          Select a room to inspect its coverage.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="panel-actions">
                    <button
                      className="button primary wide fix-button"
                      onClick={() => void action("fix")}
                      disabled={busy || complete}
                    >
                      {busy ? (
                        <LoaderCircle className="spin" size={17} />
                      ) : complete ? (
                        <Check size={17} />
                      ) : (
                        <WandSparkles size={17} />
                      )}
                      Auto-fix floor
                    </button>
                    <p>Add missing detectors. Update the BOM.</p>
                  </div>
                  <div className="disclaimer">
                    <ShieldCheck size={13} />
                    Design aid, not a stamped review
                  </div>
                </aside>
              </div>
              <div className="workspace-footer">
                <span className="live-message" role="status">
                  {message || "AI layout loaded. Coverage check is up to date."}
                </span>
                <Link to="/story">
                  Why this check matters <ArrowUpRight size={13} />
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
