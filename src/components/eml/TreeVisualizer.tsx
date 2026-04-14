import { useMemo, useState } from 'react';

import { TreeSvg } from './TreeSvg';

import { c, type Complex } from '@/lib/eml/complex';
import { layoutTree } from '@/lib/eml/layout';
import { library } from '@/lib/eml/library';
import { formatRpn, toRpn } from '@/lib/eml/rpn';
import { depth, nodeCount, type Env } from '@/lib/eml/tree';

const parseNumber = (s: string, fallback: number): number => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
};

export const TreeVisualizer = () => {
  const [selected, setSelected] = useState<string>('ln(x)');
  const [xStr, setXStr] = useState('1.5');
  const [yStr, setYStr] = useState('2');

  const entry = library.find((l) => l.name === selected);
  const tree = entry?.build();

  const env = useMemo<Env>(() => {
    const x: Complex = c(parseNumber(xStr, 1));
    const y: Complex = c(parseNumber(yStr, 1));
    return { x, y };
  }, [xStr, yStr]);

  const laidOut = useMemo(() => (tree ? layoutTree(tree) : null), [tree]);
  const rpn = useMemo(() => (tree ? formatRpn(toRpn(tree)) : ''), [tree]);
  const k = tree ? nodeCount(tree) : 0;
  const d = tree ? depth(tree) : 0;

  const needsY = entry?.kind === 'binary';

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
          x=
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

      <div className="overflow-auto rounded border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
        {laidOut && <TreeSvg laidOut={laidOut} env={env} />}
      </div>

      <details className="mt-3 font-mono text-xs">
        <summary className="cursor-pointer text-neutral-600 dark:text-neutral-300">
          RPN
        </summary>
        <code className="mt-1 block break-all text-neutral-800 dark:text-neutral-200">
          {rpn}
        </code>
      </details>
    </div>
  );
};
