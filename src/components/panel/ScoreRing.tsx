import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
export function ScoreRing({ score }: { score: number }) {
  const ref = useRef<HTMLSpanElement>(null),
    previous = useRef(score),
    reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = `${Math.round(score)}%`;
      previous.current = score;
      return;
    }
    const control = animate(previous.current, score, {
      duration: 0.8,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}%`;
      },
    });
    previous.current = score;
    return () => control.stop();
  }, [score, reduced]);
  return (
    <div className={`score-ring ${score === 100 ? "complete" : ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="score-track" cx="50" cy="50" r="44" />
        <motion.circle
          className="score-fill"
          cx="50"
          cy="50"
          r="44"
          strokeDasharray="276.46"
          animate={{ strokeDashoffset: 276.46 * (1 - score / 100) }}
          transition={{ duration: reduced ? 0 : 0.8 }}
        />
      </svg>
      <span ref={ref} data-testid="coverage-score">
        {Math.round(score)}%
      </span>
    </div>
  );
}
