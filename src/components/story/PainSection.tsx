import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { Reveal } from "./Reveal";
export function PainSection() {
  const reduced = useReducedMotion(),
    [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [reduced]);
  return (
    <section id="the-gap" data-story-section="pain" className="pain-section">
      <Reveal>
        <h2>
          AI places the devices.
          <br />
          Then a designer checks every room by hand.
        </h2>
        <blockquote>
          “AI-assisted first pass, reviewed by your designer.”
          <cite>The standard promise of AI layout tools in this space</cite>
        </blockquote>
        <p>
          The tedious part is still there: trace the radius, inspect the
          corners, count again. Designers in fire-alarm forums keep asking how
          spacing works in irregular rooms, and rules vary by jurisdiction. One
          blind spot is one more revision, or a failed inspection.
        </p>
      </Reveal>
      <div className="manual-check">
        <div className="manual-plan">
          <svg viewBox="0 0 400 230" aria-hidden="true">
            <path d="M20 20H380V210H20Z M150 20V155H20 M270 20V155H150 M270 155H380" />
            <text x="80" y="48">
              LOBBY
            </text>
            <text x="194" y="48">
              EXAM
            </text>
            <text x="306" y="48">
              OFFICE
            </text>
            <text x="190" y="190">
              CORRIDOR
            </text>
          </svg>
          <motion.div
            className="manual-radius"
            animate={reduced ? {} : { x: [0, 120, 200, 0], y: [0, 0, 80, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>21 ft</span>
            <MousePointer2 size={23} />
          </motion.div>
        </div>
        <div className="review-clock">
          <span>Manual review · illustrative timer</span>
          <code>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </code>
        </div>
      </div>
    </section>
  );
}
