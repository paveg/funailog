import { useMemo } from 'react';

import type { Complex } from '@/lib/eml/complex';
import type { LaidOutTree } from '@/lib/eml/layout';

import { evaluate, type Env } from '@/lib/eml/tree';

type Props = {
  readonly laidOut: LaidOutTree;
  readonly env: Env;
  readonly unit?: number; // pixels per grid unit
  readonly nodeRadius?: number;
};

const defaultUnit = 48;
const defaultRadius = 16;

const formatValue = (z: Complex): string => {
  if (!Number.isFinite(z.re) || !Number.isFinite(z.im)) {
    return `${z.re}${Number.isNaN(z.im) ? '+NaNi' : z.im === 0 ? '' : '+' + z.im + 'i'}`;
  }
  if (Math.abs(z.im) < 1e-10) {
    const v = z.re;
    if (Math.abs(v) > 1e4 || (Math.abs(v) < 1e-3 && v !== 0)) {
      return v.toExponential(2);
    }
    return Number.isInteger(v) ? v.toString() : v.toFixed(3);
  }
  return `${z.re.toFixed(2)}+${z.im.toFixed(2)}i`;
};

export const TreeSvg = ({
  laidOut,
  env,
  unit = defaultUnit,
  nodeRadius = defaultRadius,
}: Props) => {
  const values = useMemo(() => {
    const map = new Map<string, Complex>();
    for (const n of laidOut.nodes) {
      try {
        map.set(n.id, evaluate(n.tree, env));
      } catch {
        // variable unbound; skip
      }
    }
    return map;
  }, [laidOut, env]);

  const byId = useMemo(
    () => new Map(laidOut.nodes.map((n) => [n.id, n])),
    [laidOut],
  );

  const padX = nodeRadius + 8;
  const padY = nodeRadius + 8;
  const w = laidOut.width * unit + padX * 2;
  const h = laidOut.height * unit + padY * 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full font-mono"
      role="img"
      aria-label="EML tree"
    >
      {laidOut.nodes.map((n) => {
        if (!n.parentId) return null;
        const parent = byId.get(n.parentId);
        if (!parent) return null;
        return (
          <line
            key={`edge-${n.id}`}
            x1={parent.x * unit + padX}
            y1={parent.y * unit + padY}
            x2={n.x * unit + padX}
            y2={n.y * unit + padY}
            stroke="currentColor"
            strokeWidth={1}
            className="text-neutral-400 dark:text-neutral-600"
          />
        );
      })}
      {laidOut.nodes.map((n) => {
        const cx = n.x * unit + padX;
        const cy = n.y * unit + padY;
        const value = values.get(n.id);
        const fill =
          n.kind === 'eml'
            ? 'rgb(251 146 60)' // orange-400
            : n.kind === 'const'
              ? 'rgb(148 163 184)' // slate-400
              : 'rgb(96 165 250)'; // blue-400
        return (
          <g key={n.id}>
            <circle cx={cx} cy={cy} r={nodeRadius} fill={fill} />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="white"
            >
              {n.label}
            </text>
            {value && (
              <text
                x={cx}
                y={cy + nodeRadius + 12}
                textAnchor="middle"
                fontSize={10}
                className="fill-neutral-700 dark:fill-neutral-300"
              >
                {formatValue(value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
