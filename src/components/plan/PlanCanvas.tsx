import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { bbox } from "../../../shared/geometry";
import type { Sheet, Device, SheetReport } from "../../../shared/types";
import { DeviceGlyph } from "./DeviceGlyph";
import { HeatmapLayer } from "./HeatmapLayer";
import { CoverageRings } from "./CoverageRings";
export interface PlanCanvasProps {
  sheet: Sheet;
  devices: Device[];
  report?: SheetReport;
  rings?: boolean;
  heatmap?: boolean;
  selected?: string | null;
  onSelect?: (id: string) => void;
  zoom?: number;
  allGreen?: boolean;
}
export function PlanCanvas({
  sheet,
  devices,
  report,
  rings = false,
  heatmap = true,
  selected,
  onSelect,
  zoom = 1,
  allGreen = false,
}: PlanCanvasProps) {
  const prefix = useId().replace(/:/g, ""),
    reduced = useReducedMotion();
  const room = sheet.rooms.find((r) => r.id === selected),
    box = room ? bbox(room.polygon) : null;
  const viewBox = box
    ? `${box.minX - 10} ${box.minY - 10} ${box.maxX - box.minX + 20} ${box.maxY - box.minY + 20}`
    : `${80 - 88 / zoom} ${48 - 54 / zoom} ${176 / zoom} ${108 / zoom}`;
  return (
    <motion.svg
      className="plan-svg"
      aria-label="FA-201 fire alarm floor plan"
      role="img"
      viewBox={viewBox}
      animate={{ viewBox }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        {sheet.rooms.map((r) => (
          <clipPath key={r.id} id={`${prefix}-${r.id}`}>
            <polygon points={r.polygon.map((p) => `${p.x},${p.y}`).join(" ")} />
          </clipPath>
        ))}
        <pattern
          id={`${prefix}-grid`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="0" cy="0" r=".12" className="grid-dot" />
        </pattern>
      </defs>
      <rect
        x="-20"
        y="-20"
        width="200"
        height="140"
        fill={`url(#${prefix}-grid)`}
      />
      <path
        d="M 5 5 H 153 V 37 H 161 V 51 H 153 V 72 H 111 V 81 H 61 V 91 H 5 Z"
        className="building-outline"
      />
      <g className="dimension-lines">
        <path d="M8 1H158 M8 -1V3 M158 -1V3 M1 8V88 M-1 8H3 M-1 88H3" />
        <text x="83" y="0" textAnchor="middle">
          150′–0″
        </text>
        <text transform="translate(0 48) rotate(-90)" textAnchor="middle">
          80′–0″
        </text>
      </g>
      <g>
        {sheet.rooms.map((r) => {
          const failing = report?.rooms.find((x) => x.roomId === r.id)
            ?.violations.length;
          return (
            <polygon
              key={r.id}
              points={r.polygon.map((p) => `${p.x},${p.y}`).join(" ")}
              className={`room ${selected === r.id ? "selected" : ""} ${allGreen ? "passed" : ""} ${failing ? "failing" : ""}`}
              onClick={() => onSelect?.(r.id)}
            />
          );
        })}
      </g>
      {heatmap && report && <HeatmapLayer report={report} devices={devices} />}
      {rings && <CoverageRings devices={devices} prefix={prefix} />}
      <g className="doors">
        {sheet.rooms.map((r) => {
          const b = bbox(r.polygon),
            x = (b.minX + b.maxX) / 2,
            y = b.maxY;
          return (
            <g key={r.id}>
              <path d={`M${x - 1.5} ${y}h3`} className="door-gap" />
              <path
                d={`M${x - 1.5} ${y}v-3 M${x - 1.5} ${y - 3}a3 3 0 0 1 3 3`}
              />
            </g>
          );
        })}
      </g>
      <g className="room-labels">
        {sheet.rooms.map((r) => {
          const b = bbox(r.polygon),
            small = b.maxX - b.minX < 12;
          return (
            <g
              key={r.id}
              transform={`translate(${(b.minX + b.maxX) / 2} ${r.tag === "corridor" ? b.minY + 1.9 : b.minY + 3.4})`}
            >
              <text textAnchor="middle" fontSize={small ? 1.15 : 1.55}>
                {r.name}
              </text>
              {r.tag !== "corridor" && (
                <text className="room-number" textAnchor="middle" y="2.2">
                  {r.id === "electrical"
                    ? "ELEC."
                    : `${Math.round(b.maxX - b.minX)}′ × ${Math.round(b.maxY - b.minY)}′`}
                </text>
              )}
            </g>
          );
        })}
      </g>
      {devices.map((d, i) => (
        <DeviceGlyph key={d.id} device={d} index={i} />
      ))}
      <g className="plan-furniture" aria-hidden="true">
        {sheet.rooms
          .filter((r) => r.tag === "exam")
          .map((r) => {
            const b = bbox(r.polygon);
            return (
              <g key={r.id}>
                <rect
                  x={b.minX + 1}
                  y={b.maxY - 5}
                  width="3"
                  height="4"
                  rx=".3"
                />
                <path d={`M${b.minX + 1} ${b.maxY - 4}h3`} />
                <rect x={b.maxX - 3} y={b.maxY - 2} width="2" height="1" />
              </g>
            );
          })}
        <rect x="87" y="69" width="12" height="4" rx="1" />
        {[88, 92, 96].map((x) => (
          <g key={x}>
            <rect x={x} y="67.5" width="2" height="1" />
            <rect x={x} y="73.5" width="2" height="1" />
          </g>
        ))}
        <path d="M11 32h12v3H11z M11 60h3v5h-3z M57 65h11v2H57z" />
      </g>
      <g className="plan-footer">
        <text x="8" y="94">
          RIVERSIDE MEDICAL CENTER · LEVEL 02
        </text>
        <text x="158" y="94" textAnchor="end">
          FA-201 / FIRE ALARM
        </text>
      </g>
    </motion.svg>
  );
}
