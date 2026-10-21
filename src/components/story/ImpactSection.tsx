import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { checkSheet } from "../../../shared/check";
import {
  sheet,
  initialDevices,
  before,
  after,
  addedCount,
  bomDelta,
} from "./story-data";
import { money } from "../panel/BomTable";
import { Reveal } from "./Reveal";
export function ImpactSection() {
  const [elapsed, setElapsed] = useState<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    checkSheet(sheet, initialDevices);
    setElapsed(performance.now() - start);
  }, []);
  return (
    <section data-story-section="impact" className="impact-section">
      <Reveal>
        <h2>
          Less guesswork.
          <br />A complete picture.
        </h2>
        <p>
          Measured on this drawing. Updated by the same engine that runs the
          app.
        </p>
      </Reveal>
      <div className="impact-grid">
        <Reveal>
          <span>Ceiling coverage</span>
          <div>
            <del>{Math.round(before.summary.coveragePct)}%</del>
            <strong className="impact-value">
              {Math.round(after.summary.coveragePct)}%
            </strong>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <span>Rooms failing</span>
          <div>
            <del>{before.summary.roomsFailing}</del>
            <strong className="impact-value">
              {after.summary.roomsFailing}
            </strong>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <span>Detectors added</span>
          <div>
            <strong className="impact-value">+{addedCount}</strong>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <span>Material delta</span>
          <div>
            <strong className="impact-value">+{money(bomDelta)}</strong>
          </div>
        </Reveal>
      </div>
      <div className="impact-meta">
        <code>
          CHECK TIME:{" "}
          {elapsed === null ? "MEASURING…" : `${elapsed.toFixed(1)} ms`} /{" "}
          {sheet.rooms.length}-ROOM FLOOR
        </code>
        <p>
          Estimated review saving: 10–20 minutes per sheet.
          <br />
          <span>Illustrative estimate, not a measured customer outcome.</span>
        </p>
      </div>
      <Link className="button primary story-cta" to="/">
        Open FA-201 <ArrowRight size={19} />
      </Link>
      <p className="story-scope">
        Smooth, flat ceilings ≤ 10 ft · Spot detectors only · Design aid, not a
        stamped review
      </p>
    </section>
  );
}
