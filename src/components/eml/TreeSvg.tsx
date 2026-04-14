import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

import type { Complex } from '@/lib/eml/complex';
import type { LaidOutTree } from '@/lib/eml/layout';

import { evaluate, type Env } from '@/lib/eml/tree';

type Props = {
  readonly laidOut: LaidOutTree;
  readonly env: Env;
  readonly unit?: number;
  readonly nodeRadius?: number;
  readonly signature?: string;
};

const targetWidth = 720;
const maxUnit = 40;
const minUnit = 14;

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
  unit: unitOverride,
  nodeRadius: radiusOverride,
  signature = '',
}: Props) => {
  const unit =
    unitOverride ??
    Math.max(
      minUnit,
      Math.min(maxUnit, targetWidth / Math.max(1, laidOut.width)),
    );
  const nodeRadius = radiusOverride ?? Math.max(8, Math.min(16, unit * 0.35));

  const values = useMemo(() => {
    const map = new Map<string, Complex>();
    for (const n of laidOut.nodes) {
      try {
        map.set(n.id, evaluate(n.tree, env));
      } catch {
        // unbound variable; skip
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

  const maxDepth = Math.max(1, ...laidOut.nodes.map((n) => n.depth));
  const staggerFor = (depth: number) =>
    (depth / maxDepth) * Math.min(0.6, laidOut.nodes.length * 0.008);

  const tooltipFont = 11;
  const charW = tooltipFont * 0.62;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="eml-tree h-auto w-full font-mono"
      role="img"
      aria-label="EML tree"
    >
      <style>{`
        .eml-tree .eml-tip { opacity: 0; transition: opacity 120ms ease-out; pointer-events: none; }
        .eml-tree .eml-node:hover .eml-tip,
        .eml-tree .eml-node:focus-within .eml-tip { opacity: 1; }
        .eml-tree .eml-node circle { cursor: pointer; outline: none; }
      `}</style>
      <AnimatePresence mode="wait">
        <motion.g key={signature}>
          {laidOut.nodes.map((n) => {
            if (!n.parentId) return null;
            const parent = byId.get(n.parentId);
            if (!parent) return null;
            return (
              <motion.line
                key={`edge-${n.id}`}
                x1={parent.x * unit + padX}
                y1={parent.y * unit + padY}
                x2={n.x * unit + padX}
                y2={n.y * unit + padY}
                stroke="currentColor"
                strokeWidth={1}
                className="text-neutral-400 dark:text-neutral-600"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: staggerFor(n.depth),
                }}
              />
            );
          })}
          {laidOut.nodes.map((n) => {
            const cx = n.x * unit + padX;
            const cy = n.y * unit + padY;
            const fill =
              n.kind === 'eml'
                ? 'rgb(251 146 60)'
                : n.kind === 'const'
                  ? 'rgb(148 163 184)'
                  : 'rgb(96 165 250)';
            const value = values.get(n.id);
            const display = value
              ? n.kind === 'eml'
                ? `eml(…) = ${formatValue(value)}`
                : `${n.label} = ${formatValue(value)}`
              : null;
            const tipW = display ? display.length * charW + 12 : 0;
            const tipH = tooltipFont + 10;
            const tipX = Math.max(2, Math.min(w - tipW - 2, cx - tipW / 2));
            const above = cy - nodeRadius - 6 - tipH > 0;
            const tipY = above
              ? cy - nodeRadius - 6 - tipH
              : cy + nodeRadius + 6;
            return (
              <motion.g
                key={n.id}
                className="eml-node"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: staggerFor(n.depth) + 0.08,
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill={fill}
                  tabIndex={0}
                />
                <text
                  x={cx}
                  y={cy + nodeRadius * 0.3}
                  textAnchor="middle"
                  fontSize={nodeRadius * 0.85}
                  fontWeight={600}
                  fill="white"
                  pointerEvents="none"
                >
                  {n.label}
                </text>
                {display && (
                  <g className="eml-tip">
                    <rect
                      x={tipX}
                      y={tipY}
                      width={tipW}
                      height={tipH}
                      rx={4}
                      className="fill-neutral-900 dark:fill-neutral-100"
                    />
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + tipH / 2 + tooltipFont * 0.35}
                      textAnchor="middle"
                      fontSize={tooltipFont}
                      className="fill-white dark:fill-neutral-900"
                    >
                      {display}
                    </text>
                  </g>
                )}
              </motion.g>
            );
          })}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
};
