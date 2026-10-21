import { Reveal } from "./Reveal";
export function HowSection() {
  return (
    <section data-story-section="how" className="how-section">
      <Reveal>
        <h2>Geometry, made useful.</h2>
        <p>Three deterministic steps. Every placement has a reason.</p>
      </Reveal>
      <div className="how-steps">
        <Reveal className="how-step">
          <div className="micro-grid">
            {Array.from({ length: 36 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
          <code>01 / SAMPLE</code>
          <h3>A 1 ft ceiling grid.</h3>
          <p>
            Sample inside each room polygon, including irregular rooms and
            L-shaped corners.
          </p>
        </Reveal>
        <Reveal className="how-step" delay={0.08}>
          <div className="micro-radius">
            <i />
            <span>S</span>
            <b>0.7 × S</b>
          </div>
          <code>02 / CHECK</code>
          <h3>Distance, plus line of sight.</h3>
          <p>
            A detector covers a point within 0.7 × its listed spacing, with no
            wall in between.
          </p>
        </Reveal>
        <Reveal className="how-step" delay={0.16}>
          <div className="micro-snap">
            <span>S</span>
            <i />
            <span>S</span>
          </div>
          <code>03 / RESOLVE</code>
          <h3>The next best addition.</h3>
          <p>
            Greedy placement covers the most remaining gaps first. Near-minimal
            additions, with the BOM kept in sync.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
