import { useMemo, useState } from 'react';

import { TreeSvg } from './TreeSvg';

import { c, type Complex } from '@/lib/eml/complex';
import { layoutTree } from '@/lib/eml/layout';
import { library } from '@/lib/eml/library';
import { formatRpn, toRpn } from '@/lib/eml/rpn';
import { depth, evaluate, nodeCount, type Env } from '@/lib/eml/tree';

const parseNumber = (s: string, fallback: number): number => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
};

const reference: Record<string, (x: number, y: number) => number> = {
  'exp(x)': (x) => Math.exp(x),
  e: () => Math.E,
  'ln(x)': (x) => Math.log(x),
  'x+1': (x) => x + 1,
  'x-1': (x) => x - 1,
  '-x': (x) => -x,
  '1/x': (x) => 1 / x,
  'x²': (x) => x * x,
  'x+y': (x, y) => x + y,
  'x×y': (x, y) => x * y,
  'x-y': (x, y) => x - y,
  'x/y': (x, y) => x / y,
};

const fmt = (z: Complex): string => {
  if (!Number.isFinite(z.re) || !Number.isFinite(z.im)) return `${z.re}`;
  if (Math.abs(z.im) < 1e-10) return z.re.toPrecision(8);
  return `${z.re.toPrecision(6)}+${z.im.toPrecision(6)}i`;
};

const fmtNumber = (n: number): string =>
  Number.isFinite(n) ? n.toPrecision(8) : String(n);

export const TreeVisualizer = () => {
  const [selected, setSelected] = useState<string>('ln(x)');
  const [xStr, setXStr] = useState('2.5');
  const [yStr, setYStr] = useState('3');

  const entry = library.find((l) => l.name === selected);
  const tree = entry?.build();

  const xNum = parseNumber(xStr, 1);
  const yNum = parseNumber(yStr, 1);

  const env = useMemo<Env>(() => ({ x: c(xNum), y: c(yNum) }), [xNum, yNum]);

  const laidOut = useMemo(() => (tree ? layoutTree(tree) : null), [tree]);
  const rpn = useMemo(() => (tree ? formatRpn(toRpn(tree)) : ''), [tree]);
  const k = tree ? nodeCount(tree) : 0;
  const d = tree ? depth(tree) : 0;

  const needsY = entry?.kind === 'binary';

  const treeValue = tree ? evaluate(tree, env) : null;
  const refValue = entry ? reference[entry.name]?.(xNum, yNum) : undefined;
  const match =
    treeValue !== null &&
    refValue !== undefined &&
    Math.abs(treeValue.re - refValue) < 1e-6 &&
    Math.abs(treeValue.im) < 1e-6;

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1 font-mono">
          function
          <select
            className="rounded border px-2 py-1 dark:bg-neutral-800"
            value={selected}
            onChange={(ev) => setSelected(ev.target.value)}
          >
            {library.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 font-mono">
          input x=
          <input
            className="w-20 rounded border px-2 py-1 dark:bg-neutral-800"
            value={xStr}
            onChange={(ev) => setXStr(ev.target.value)}
            inputMode="decimal"
          />
        </label>
        {needsY && (
          <label className="flex items-center gap-1 font-mono">
            y=
            <input
              className="w-20 rounded border px-2 py-1 dark:bg-neutral-800"
              value={yStr}
              onChange={(ev) => setYStr(ev.target.value)}
              inputMode="decimal"
            />
          </label>
        )}
        <div className="ml-auto font-mono text-xs text-neutral-600 dark:text-neutral-300">
          depth {d} · K {k} · paper K {entry?.paperK}
        </div>
      </div>

      <div className="mb-3 rounded border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid gap-1 sm:grid-cols-2">
          <div>
            <span className="text-xs text-neutral-500">eml tree →</span>{' '}
            <span className="font-semibold">
              {treeValue ? fmt(treeValue) : '—'}
            </span>
          </div>
          <div>
            <span className="text-xs text-neutral-500">Math reference →</span>{' '}
            <span className="font-semibold">
              {refValue !== undefined ? fmtNumber(refValue) : '—'}
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs">
          {match ? (
            <span className="text-green-600 dark:text-green-400">
              ✓ values match — this eml tree really is {entry?.name}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">
              values differ (domain edge case or non-real input)
            </span>
          )}
        </div>
      </div>

      <div className="overflow-auto rounded border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
        {laidOut && <TreeSvg laidOut={laidOut} env={env} />}
      </div>

      <details className="mt-3 font-mono text-xs">
        <summary className="cursor-pointer text-neutral-600 dark:text-neutral-300">
          RPN program ({k} tokens)
        </summary>
        <code className="mt-1 block break-all text-neutral-800 dark:text-neutral-200">
          {rpn}
        </code>
      </details>
    </div>
  );
};
