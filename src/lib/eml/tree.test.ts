import { describe, expect, it } from 'vitest';

import { c, type Complex } from './complex';
import { c1, depth, e, eml, evaluate, nodeCount, v } from './tree';

const close = (a: number, b: number, tol = 1e-10) =>
  Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const cEq = (a: Complex, b: Complex, tol = 1e-10) =>
  close(a.re, b.re, tol) && close(a.im, b.im, tol);

describe('eml operator', () => {
  it('eml(x, 1) = exp(x) since ln(1) = 0', () => {
    expect(cEq(eml(c(1.5), c(1)), c(Math.exp(1.5)))).toBe(true);
  });

  it('eml(1, 1) = e', () => {
    expect(cEq(eml(c(1), c(1)), c(Math.E))).toBe(true);
  });

  it('eml(0, e) = 0 since exp(0)=1 and ln(e)=1', () => {
    expect(cEq(eml(c(0), c(Math.E)), c(0))).toBe(true);
  });
});

describe('evaluate', () => {
  it('const → 1', () => {
    expect(evaluate(c1)).toEqual({ re: 1, im: 0 });
  });

  it('looks up variables from env', () => {
    const z = c(3, 4);
    expect(evaluate(v('x'), { x: z })).toEqual(z);
  });

  it('evaluates exp(x) = eml(x, 1) tree at x=2', () => {
    const expTree = e(v('x'), c1);
    expect(cEq(evaluate(expTree, { x: c(2) }), c(Math.exp(2)))).toBe(true);
  });

  it('throws on unbound variable', () => {
    expect(() => evaluate(v('y'), {})).toThrow(/Unbound variable/);
  });
});

describe('structural metrics', () => {
  it('depth(const) = 0, depth(var) = 0', () => {
    expect(depth(c1)).toBe(0);
    expect(depth(v('x'))).toBe(0);
  });

  it('depth(eml(x, 1)) = 1', () => {
    expect(depth(e(v('x'), c1))).toBe(1);
  });

  it('nodeCount counts leaves and internals', () => {
    // eml(eml(1, x), 1) → 2 emls + 3 leaves = 5 nodes
    expect(nodeCount(e(e(c1, v('x')), c1))).toBe(5);
  });
});
