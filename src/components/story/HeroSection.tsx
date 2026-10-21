import { ArrowDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { PlanCanvas } from "../plan/PlanCanvas";
import { sheet, initialDevices, before } from "./story-data";
export function HeroSection() {
  return (
    <section className="story-hero" data-story-section="problem">
      <div className="hero-copy">
        <Reveal>
          <span className="eyebrow-chip">
            <b>72</b> Independent project · Fire-alarm design
          </span>
          <h1>
            Detector layouts are drawn in minutes. Checking them still takes
            hours.
          </h1>
          <p>
            Fire-alarm designers now get a first pass of smoke and heat
            detectors from software. Before it can be built, someone still has
            to prove every square foot of ceiling is covered under NFPA 72.
          </p>
          <a className="text-button" href="#the-gap">
            Explore Coverage Check <ArrowDown size={17} />
          </a>
        </Reveal>
      </div>
      <Reveal className="hero-drawing" delay={0.08}>
        <div className="mini-plan-label">
          <span className="blue-dot" />
          AI first pass <code>FA-201</code>
        </div>
        <PlanCanvas sheet={sheet} devices={initialDevices} heatmap={false} />
        <div className="mini-plan-foot">
          <span>{initialDevices.length} detectors placed</span>
          <span>Ready for designer review</span>
        </div>
      </Reveal>
      <div className="domain-stats">
        <Reveal>
          <strong>
            <Counter value={0.7} decimals={1} suffix=" × S" />
          </strong>
          <p>max distance from any ceiling point to a detector</p>
          <a
            href="https://nationaltrainingcenter.com/the-point-7-rule/"
            target="_blank"
            rel="noreferrer"
          >
            SOURCE: THE “POINT 7” RULE ↗
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <strong>
            <Counter value={21} suffix=" ft" />
          </strong>
          <p>radius for a 30 ft listed smoke detector</p>
          <span className="stat-note">0.7 × 30 FT</span>
        </Reveal>
        <Reveal delay={0.16}>
          <strong>
            <Counter
              value={before.summary.roomsFailing}
              suffix={`/${sheet.rooms.length}`}
            />
          </strong>
          <p>rooms failing on this sample first pass</p>
          <span className="stat-note">MEASURED BY THE ENGINE</span>
        </Reveal>
      </div>
    </section>
  );
}
