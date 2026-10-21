import { motion, useReducedMotion } from "framer-motion";
import type { Device } from "../../../shared/types";
export function CoverageRings({
  devices,
  prefix,
}: {
  devices: Device[];
  prefix: string;
}) {
  const reduced = useReducedMotion();
  return (
    <g className="coverage-rings" aria-hidden="true">
      {devices
        .filter((d) => d.roomId)
        .map((d) => (
          <g key={d.id} clipPath={`url(#${prefix}-${d.roomId})`}>
            <motion.circle
              cx={d.x}
              cy={d.y}
              r={d.listedSpacingFt * 0.7}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </g>
        ))}
    </g>
  );
}
