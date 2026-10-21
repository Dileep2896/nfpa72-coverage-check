import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlanCanvas } from "../plan/PlanCanvas";
import {
  sheet,
  initialDevices,
  fixedDevices,
  before,
  after,
} from "./story-data";
const labels = [
  "AI first pass",
  "Draw the coverage",
  "Find the blind spots",
  "Add what’s missing",
  "Ready for review",
];
function Stage({ stage, progress = 0 }: { stage: number; progress?: number }) {
  const fixed = stage >= 3;
  return (
    <div className={`story-diagram stage-${stage}`}>
      <div className="diagram-toolbar">
        <span>
          Riverside Medical Center <span className="muted">/ FA-201</span>
        </span>
        <span className={stage === 4 ? "success-text" : "blue-text"}>
          {labels[stage]}
        </span>
      </div>
      <div className="diagram-body">
        <PlanCanvas
          sheet={sheet}
          devices={fixed ? fixedDevices : initialDevices}
          report={fixed ? after : before}
          rings={stage >= 1}
          heatmap={stage >= 2}
          allGreen={stage === 4}
        />
        <div className="diagram-score">
          <span>CEILING COVERAGE</span>
          <strong>
            {Math.round(
              stage === 4
                ? 100
                : before.summary.coveragePct +
                    (100 - before.summary.coveragePct) * progress,
            )}
            <small>%</small>
          </strong>
          <p>
            {fixed ? "Every room covered" : "Find the gaps. Close the loop."}
          </p>
        </div>
      </div>
    </div>
  );
}
export function DiagramSection() {
  const root = useRef<HTMLElement>(null),
    pin = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion();
  const [stage, setStage] = useState(0),
    [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reduced || !root.current || !pin.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        pin: pin.current,
        start: "top top",
        end: "+=2200",
        scrub: 1,
        onUpdate: (self) => {
          setStage(Math.min(4, Math.floor(self.progress * 5)));
          setProgress(Math.max(0, Math.min(1, (self.progress - 0.6) / 0.3)));
        },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);
  return (
    <section
      ref={root}
      data-story-section="diagram"
      className="diagram-section"
    >
      <div ref={pin} className="diagram-pin">
        <div className="diagram-heading">
          <h2>
            From first pass
            <br />
            to full coverage.
          </h2>
          <p>
            A check you can see.
            <br />A fix you can trace.
          </p>
        </div>
        {reduced ? (
          <div data-testid="static-stages" className="static-stages">
            {labels.map((label, i) => (
              <div key={label}>
                <h3>{label}</h3>
                <Stage stage={i} progress={i >= 3 ? 1 : 0} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <Stage stage={stage} progress={progress} />
            <div className="stage-track">
              {labels.map((label, i) => (
                <span key={label} className={stage >= i ? "active" : ""}>
                  <i />
                  {label}
                </span>
              ))}
            </div>
            <p className="scroll-note">Scroll to check the layout →</p>
          </>
        )}
      </div>
    </section>
  );
}
