import { motion, useReducedMotion } from "framer-motion";
import type { Device } from "../../../shared/types";
export function DeviceGlyph({
  device,
  index = 0,
}: {
  device: Device;
  index?: number;
}) {
  const reduced = useReducedMotion(),
    added = device.source === "autofix";
  return (
    <g
      transform={`translate(${device.x} ${device.y})`}
      className={`device ${added ? "added" : ""}`}
    >
      <title>
        {device.type === "smoke" ? "Smoke" : "Heat"} detector · {device.id}
        {added ? " · auto-fix addition" : ""}
      </title>
      {added && !reduced && (
        <motion.circle
          r="2"
          className="device-pulse"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.2, delay: index * 0.04 }}
        />
      )}
      <motion.g
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.025 }}
      >
        <circle r="1.25" />
        <text y=".52" textAnchor="middle">
          {device.type === "smoke" ? "S" : "H"}
        </text>
      </motion.g>
    </g>
  );
}
