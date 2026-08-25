import { useId } from "react";
import type { SeriesPoint } from "./model.ts";
import type { ConeBand } from "./random.ts";
import { formatCurrency, type Locale } from "./format.ts";

export interface ChartLine {
  points: SeriesPoint[];
  color: string;
  label: string;
  dashed?: boolean;
  fill?: boolean;
}

interface ChartProps {
  lines?: ChartLine[];
  /** Optional Monte Carlo cone rendered as a shaded p10–p90 band + p50 line. */
  cone?: ConeBand[];
  locale: Locale;
  /** Accessible summary of the key figure (peak / median). */
  summary: string;
  width?: number;
  height?: number;
}

const PAD = { top: 16, right: 16, bottom: 28, left: 8 };
const CONE_FILL = "#34d399";

/**
 * Shared SVG chart for the sandbox lenses (zero deps). Draws any number of
 * lines and, optionally, a Monte Carlo cone (shaded band + median). The line
 * draw animation is CSS-driven and disabled under prefers-reduced-motion (see
 * index.css .lab-curve-line); every value stays legible without animation and
 * the accessible summary is always present.
 */
export function Chart({
  lines = [],
  cone,
  locale,
  summary,
  width = 640,
  height = 280,
}: ChartProps) {
  const gradId = useId();
  const linePoints = lines.flatMap((l) => l.points);
  const conePoints = cone?.flatMap((b) => [b.p10, b.p50, b.p90]) ?? [];
  const years = [
    ...linePoints.map((p) => p.year),
    ...(cone?.map((b) => b.year) ?? []),
  ];
  const balances = [...linePoints.map((p) => p.balance), ...conePoints];
  const maxYear = Math.max(1, ...years);
  const maxBalance = Math.max(1, ...balances);

  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const x = (year: number) => PAD.left + (year / maxYear) * plotW;
  const y = (balance: number) =>
    PAD.top + plotH - (balance / maxBalance) * plotH;

  const toPath = (points: SeriesPoint[]) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.balance)}`)
      .join(" ");

  const conePath = () => {
    if (!cone || cone.length === 0) return "";
    const top = cone.map((b) => `${x(b.year)} ${y(b.p90)}`);
    const bottom = cone.toReversed().map((b) => `${x(b.year)} ${y(b.p10)}`);
    return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  };

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={summary}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CONE_FILL} stopOpacity="0.28" />
            <stop offset="100%" stopColor={CONE_FILL} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <line
          x1={PAD.left}
          y1={PAD.top + plotH}
          x2={PAD.left + plotW}
          y2={PAD.top + plotH}
          stroke="rgba(255,255,255,0.12)"
        />

        {cone && cone.length > 0 && (
          <>
            <path d={conePath()} fill={`url(#${gradId})`} />
            <path
              d={toPath(cone.map((b) => ({ year: b.year, balance: b.p50 })))}
              fill="none"
              stroke={CONE_FILL}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </>
        )}

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

      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
        {cone && cone.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-4 rounded-full"
              style={{ backgroundColor: CONE_FILL }}
            />
            Median outcome (p10–p90 band)
          </span>
        )}
        {lines
          .filter((l) => l.label)
          .map((line) => (
            <span key={line.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-4 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              {line.label}
            </span>
          ))}
        <span className="sr-only">{summary}</span>
        <span aria-hidden className="hidden">
          {formatCurrency(maxBalance, locale)}
        </span>
      </figcaption>
    </figure>
  );
}
