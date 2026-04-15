import { describe, expect, it } from 'vitest';

import { c, type Complex } from './complex';
import {
  addTree,
  divTree,
  eTree,
  expTree,
  invTree,
  library,
  lnTree,
  mulTree,
  negTree,
  powTree,
  predTree,
  sqrTree,
  subTree,
  sucTree,
} from './library';
import { evalRpn, formatRpn, toRpn } from './rpn';
import { evaluate, nodeCount } from './tree';

const close = (a: number, b: number, tol = 1e-9) =>
  Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const cEq = (a: Complex, b: Complex, tol = 1e-9) =>
  close(a.re, b.re, tol) && close(a.im, b.im, tol);

describe('Table 4 K values (EML Compiler column)', () => {
  const expected: Array<[string, () => ReturnType<typeof expTree>, number]> = [
    ['exp(x)', () => expTree(), 3],
    ['e', () => eTree, 3],
    ['ln(x)', () => lnTree(), 7],
    ['x+1', () => sucTree(), 27],
    ['x-1', () => predTree(), 43],
    ['-x', () => negTree(), 57],
    ['1/x', () => invTree(), 65],
    ['x²', () => sqrTree(), 75],
    ['x+y', addTree, 27],
    ['x×y', mulTree, 41],
    ['x-y', subTree, 83],
    ['x/y', divTree, 105],
  ];

  for (const [name, build, k] of expected) {
    it(`${name} has K=${k}`, () => {
      expect(nodeCount(build())).toBe(k);
    });
  }
});

describe('Numerical agreement via compiler', () => {
  const x = c(1.7);
  const y = c(2.3);

  it('exp(1.7)', () => {
    expect(cEq(evaluate(expTree(), { x }), c(Math.exp(1.7)))).toBe(true);
  });

  it('ln(1.7)', () => {
    expect(cEq(evaluate(lnTree(), { x }), c(Math.log(1.7)))).toBe(true);
  });

  it('x+1 at x=1.7', () => {
    expect(cEq(evaluate(sucTree(), { x }), c(2.7))).toBe(true);
  });

  it('x-1 at x=1.7', () => {
    expect(cEq(evaluate(predTree(), { x }), c(0.7))).toBe(true);
  });

  it('-x at x=1.7', () => {
    expect(cEq(evaluate(negTree(), { x }), c(-1.7))).toBe(true);
  });

  it('1/x at x=1.7', () => {
    expect(cEq(evaluate(invTree(), { x }), c(1 / 1.7))).toBe(true);
  });

  it('x² at x=1.7', () => {
    expect(cEq(evaluate(sqrTree(), { x }), c(1.7 * 1.7))).toBe(true);
  });

  it('x+y', () => {
    expect(cEq(evaluate(addTree(), { x, y }), c(4.0))).toBe(true);
  });

  it('x×y', () => {
    expect(cEq(evaluate(mulTree(), { x, y }), c(1.7 * 2.3))).toBe(true);
  });

  it('x-y', () => {
    expect(cEq(evaluate(subTree(), { x, y }), c(-0.6))).toBe(true);
  });

  it('x/y', () => {
    expect(cEq(evaluate(divTree(), { x, y }), c(1.7 / 2.3))).toBe(true);
  });

  it('x^y at x=1.7, y=2.3', () => {
    expect(
      cEq(evaluate(powTree(), { x, y }), c(Math.pow(1.7, 2.3)), 1e-8),
    ).toBe(true);
  });
});

describe('RPN canonical forms', () => {
  it('exp(x) → "x,1,E"', () => {
    expect(formatRpn(toRpn(expTree()))).toBe('x,1,E');
  });

  it('e → "1,1,E"', () => {
    expect(formatRpn(toRpn(eTree))).toBe('1,1,E');
  });

  it('ln(x) → "1,1,x,E,1,E,E" (paper Eq. 5)', () => {
    expect(formatRpn(toRpn(lnTree()))).toBe('1,1,x,E,1,E,E');
  });
});

describe('RPN evaluator matches tree evaluator', () => {
  for (const entry of library) {
    it(`${entry.name}: stack eval ≡ tree eval`, () => {
      const tree = entry.build();
      const env = { x: c(1.7), y: c(2.3) };
      const viaTree = evaluate(tree, env);
      const viaRpn = evalRpn(toRpn(tree), env);
      expect(cEq(viaTree, viaRpn)).toBe(true);
    });
  }
});
