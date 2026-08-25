import { useId } from "react";
import type { SeriesPoint } from "./math.ts";
import { formatCurrency, type Locale } from "./format.ts";

export interface CurveLine {
  points: SeriesPoint[];
  /** Stroke color (Tailwind token via inline style). */
  color: string;
  label: string;
  /** Render the area fill beneath the line. */
  fill?: boolean;
  dashed?: boolean;
}

interface CurveProps {
  lines: CurveLine[];
  locale: Locale;
  width?: number;
  height?: number;
}

const PAD = { top: 16, right: 16, bottom: 28, left: 8 };

/**
 * The hero visual: one growing curve shared by every act. Pure SVG (zero deps).
 * The entrance animation is CSS-driven and disabled under prefers-reduced-motion
 * (see index.css .lab-curve-line); values stay legible without animation.
 */
export function Curve({
  lines,
  locale,
  width = 640,
  height = 280,
}: CurveProps) {
  const gradId = useId();
  const allPoints = lines.flatMap((l) => l.points);
  const maxYear = Math.max(1, ...allPoints.map((p) => p.year));
  const maxBalance = Math.max(1, ...allPoints.map((p) => p.balance));

  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const x = (year: number) => PAD.left + (year / maxYear) * plotW;
  const y = (balance: number) =>
    PAD.top + plotH - (balance / maxBalance) * plotH;

  const toPath = (points: SeriesPoint[]) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.balance)}`)
      .join(" ");

  const peak = Math.max(...lines.map((l) => l.points.at(-1)?.balance ?? 0));

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`Balance grows to about ${formatCurrency(peak, locale)} over ${maxYear} years`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={lines[0]?.color ?? "#34d399"}
              stopOpacity="0.35"
            />
            <stop
              offset="100%"
              stopColor={lines[0]?.color ?? "#34d399"}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line
          x1={PAD.left}
          y1={PAD.top + plotH}
          x2={PAD.left + plotW}
          y2={PAD.top + plotH}
          stroke="rgba(255,255,255,0.12)"
        />

        {lines.map((line) => (
          <g key={line.label}>
            {line.fill && (
              <path
                d={`${toPath(line.points)} L ${x(maxYear)} ${PAD.top + plotH} L ${PAD.left} ${
                  PAD.top + plotH
                } Z`}
                fill={`url(#${gradId})`}
              />
            )}
            <path
              className={line.dashed ? undefined : "lab-curve-line"}
              d={toPath(line.points)}
              fill="none"
              stroke={line.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={line.dashed ? "5 5" : undefined}
            />
          </g>
        ))}

        {/* x-axis end labels */}
        <text
          x={PAD.left}
          y={height - 8}
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
        >
          0y
        </text>
        <text
          x={PAD.left + plotW}
          y={height - 8}
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
          textAnchor="end"
        >
          {maxYear}y
        </text>
      </svg>

      {lines.length > 1 && (
        <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
          {lines.map((line) => (
            <span key={line.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-4 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              {line.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
