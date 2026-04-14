import { useMemo, useState } from 'react';

import { c, type Complex } from '@/lib/eml/complex';
import { evalRpn, RpnError, type RpnToken } from '@/lib/eml/rpn';
import { eml } from '@/lib/eml/tree';

type Preset = {
  readonly label: string;
  readonly tokens: readonly RpnToken[];
  readonly note: string;
};

const presets: readonly Preset[] = [
  { label: 'exp(x)', tokens: ['x', '1', 'E'], note: 'eml(x, 1)' },
  { label: 'e', tokens: ['1', '1', 'E'], note: 'eml(1, 1) = e' },
  {
    label: 'ln(x)',
    tokens: ['1', '1', 'x', 'E', '1', 'E', 'E'],
    note: 'paper Eq.(5), K=7',
  },
];

const stackAfter = (
  tokens: readonly RpnToken[],
  env: Record<string, Complex>,
) => {
  const stack: Complex[] = [];
  for (const tok of tokens) {
    if (tok === '1') {
      stack.push({ re: 1, im: 0 });
      continue;
    }
    if (tok === 'E') {
      const y = stack.pop();
      const x = stack.pop();
      if (!x || !y) return { stack, error: 'stack underflow' };
      stack.push(eml(x, y));
      continue;
    }
    const val = env[tok];
    if (!val) return { stack, error: `unbound: ${tok}` };
    stack.push(val);
  }
  return { stack, error: null as string | null };
};

const fmt = (z: Complex): string => {
  if (!Number.isFinite(z.re) || !Number.isFinite(z.im)) {
    return `${z.re}+${z.im}i`;
  }
  if (Math.abs(z.im) < 1e-10) return z.re.toPrecision(6);
  return `${z.re.toFixed(3)}+${z.im.toFixed(3)}i`;
};

export const RpnCalculator = () => {
  const [tokens, setTokens] = useState<readonly RpnToken[]>([]);
  const [xStr, setXStr] = useState('1.5');

  const env = useMemo<Record<string, Complex>>(() => {
    const n = Number.parseFloat(xStr);
    return { x: Number.isFinite(n) ? c(n) : c(0) };
  }, [xStr]);

  const live = useMemo(() => stackAfter(tokens, env), [tokens, env]);

  const [evalError, result] = useMemo(() => {
    if (tokens.length === 0) return [null, null] as const;
    try {
      return [null, evalRpn(tokens, env)] as const;
    } catch (e) {
      if (e instanceof RpnError) return [e.message, null] as const;
      return [String(e), null] as const;
    }
  }, [tokens, env]);

  const push = (t: RpnToken) => setTokens((prev) => [...prev, t]);
  const pop = () => setTokens((prev) => prev.slice(0, -1));
  const clear = () => setTokens([]);

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex items-center gap-3 font-mono text-sm">
        <label className="flex items-center gap-1">
          x=
          <input
            className="w-20 rounded border px-2 py-1 dark:bg-neutral-800"
            value={xStr}
            onChange={(ev) => setXStr(ev.target.value)}
            inputMode="decimal"
          />
        </label>
        <div className="ml-auto flex gap-1">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              title={p.note}
              className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              onClick={() => setTokens(p.tokens)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 min-h-[64px] rounded border border-neutral-200 bg-neutral-50 p-2 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="text-xs text-neutral-500">program</div>
        <code className="block break-all">
          {tokens.length === 0 ? (
            <span className="opacity-40">empty</span>
          ) : (
            tokens.join(',')
          )}
        </code>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-neutral-50 p-2 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500">stack (top → bottom)</div>
          {live.stack.length === 0 ? (
            <div className="opacity-40">empty</div>
          ) : (
            <ol className="mt-1">
              {[...live.stack].reverse().map((v, i) => (
                <li key={i}>{fmt(v)}</li>
              ))}
            </ol>
          )}
          {live.error && (
            <div className="mt-1 text-xs text-red-600">{live.error}</div>
          )}
        </div>
        <div className="rounded border border-neutral-200 bg-neutral-50 p-2 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500">result</div>
          <div>
            {evalError ? (
              <span className="text-red-600">{evalError}</span>
            ) : result ? (
              fmt(result)
            ) : (
              <span className="opacity-40">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <button
          type="button"
          className="rounded border border-neutral-300 py-2 font-mono text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={() => push('1')}
        >
          1
        </button>
        <button
          type="button"
          className="rounded border border-neutral-300 py-2 font-mono text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={() => push('x')}
        >
          x
        </button>
        <button
          type="button"
          className="rounded border border-orange-400 bg-orange-50 py-2 font-mono text-lg hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900"
          onClick={() => push('E')}
        >
          EML
        </button>
        <button
          type="button"
          className="rounded border border-neutral-300 py-2 font-mono text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={pop}
        >
          ←
        </button>
        <button
          type="button"
          className="rounded border border-neutral-300 py-2 font-mono text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={clear}
        >
          CLR
        </button>
      </div>
    </div>
  );
};
