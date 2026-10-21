import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
const format = (v: number, decimals: number) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const fmt = (v: number) => format(v, decimals);
  const ref = useRef<HTMLSpanElement>(null),
    inView = useInView(ref, { once: true }),
    reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || reduced) return;
    const control = animate(0, value, {
      duration: 1.5,
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = `${prefix}${format(decimals ? v : Math.round(v), decimals)}${suffix}`;
      },
    });
    return () => control.stop();
  }, [value, prefix, suffix, decimals, inView, reduced]);
  return (
    <span ref={ref}>
      {prefix}
      {fmt(value)}
      {suffix}
    </span>
  );
}
