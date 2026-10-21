import { Check, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
export function DecisionSection() {
  return (
    <section data-story-section="decision" className="decision-section">
      <Reveal>
        <h2>
          Why coverage.
          <br />
          Why now.
        </h2>
        <p>Two useful features. One sits closer to the promise.</p>
      </Reveal>
      <div className="decision-grid">
        <Reveal className="decision-card dimmed">
          <span className="decision-label">THE ALTERNATIVE</span>
          <h3>
            Revision diff
            <br />
            and change orders
          </h3>
          <p>
            Useful, but popular PDF markup tools already overlay revisions. And
            it needs two aligned sheets before it can help.
          </p>
        </Reveal>
        <Reveal className="decision-card chosen" delay={0.08}>
          <span className="decision-label">
            <Check size={16} />
            THE CHOICE
          </span>
          <h3>
            NFPA 72
            <br />
            Coverage Check
          </h3>
          <ul>
            <li>
              Closes the gap between an AI “first pass” and a code-compliant
              layout, the step every designer still does by hand.
            </li>
            <li>
              Popular design tools show camera blind spots, but none we found
              check fire-detector coverage against code.
            </li>
            <li>
              The rule is mechanical: 0.7 × listed spacing, room by room. A
              computer should check it, not a tired designer.
            </li>
          </ul>
          <a
            className="text-button"
            href="https://nationaltrainingcenter.com/the-point-7-rule/"
            target="_blank"
            rel="noreferrer"
          >
            Read about the 0.7 × S rule
            <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
