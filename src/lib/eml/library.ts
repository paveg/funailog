import {
  compAdd,
  compExp,
  compInt,
  compLog,
  compMul,
  compNeg,
  compPow,
  X,
  Y,
} from './compiler';
import { c1, v, type EMLTree } from './tree';

// Verified EML trees from Odrzywołek 2026 (arXiv:2603.21852), Table 4.
// The builders route through the ported compiler primitives in compiler.ts,
// reproducing the "EML Compiler" column K values.

// Note on the routing: the reference compiler first normalizes expressions
// through sympy, so -x becomes Mul(-1, x), x-y becomes Add(x, Mul(-1, y)),
// 1/x becomes Pow(x, -1), and so on. Going through these routes reproduces
// Table 4's "EML Compiler" K values. Direct primitives (compNeg, compSub,
// compInv, compDiv) would yield shorter trees but would not match Table 4.

const minusOne = (): EMLTree => compNeg(c1); // compile_to_eml(Integer(-1))

export const expTree = (x: string = 'x'): EMLTree => compExp(v(x));
export const eTree: EMLTree = compExp(c1); // eml_exp("1") → K=3
export const lnTree = (x: string = 'x'): EMLTree => compLog(v(x));

// -x routed via Mul(-1, x)
export const negTree = (x: string = 'x'): EMLTree => compMul(minusOne(), v(x));

// 1/x routed via Pow(x, -1)
export const invTree = (x: string = 'x'): EMLTree => compPow(v(x), minusOne());

// x + 1 routed via Add(x, 1)
export const sucTree = (x: string = 'x'): EMLTree => compAdd(v(x), c1);

// x - 1 routed via Add(x, -1)
export const predTree = (x: string = 'x'): EMLTree => compAdd(v(x), minusOne());

// x^2 routed via Pow(x, 2)
export const sqrTree = (x: string = 'x'): EMLTree => compPow(v(x), compInt(2));

// x + y routed via Add(x, y)
export const addTree = (): EMLTree => compAdd(X, Y);

// x * y routed via Mul(x, y)
export const mulTree = (): EMLTree => compMul(X, Y);

// x - y routed via Add(x, Mul(-1, y))
export const subTree = (): EMLTree => compAdd(X, compMul(minusOne(), Y));

// x / y routed via Mul(x, Pow(y, -1))
export const divTree = (): EMLTree => compMul(X, compPow(Y, minusOne()));

// x^y — direct Pow
export const powTree = (): EMLTree => compPow(X, Y);

export type LibraryEntry = {
  readonly name: string;
  readonly build: () => EMLTree;
  readonly paperK: number; // EML Compiler column
  readonly kind: 'constant' | 'unary' | 'binary';
};

export const library: readonly LibraryEntry[] = [
  // Verified exactly against Table 4
  { name: 'e', build: () => eTree, paperK: 3, kind: 'constant' },
  { name: 'exp(x)', build: () => expTree(), paperK: 3, kind: 'unary' },
  { name: 'ln(x)', build: () => lnTree(), paperK: 7, kind: 'unary' },
  { name: 'x+1', build: () => sucTree(), paperK: 27, kind: 'unary' },
  { name: 'x-1', build: () => predTree(), paperK: 43, kind: 'unary' },
  { name: '-x', build: () => negTree(), paperK: 57, kind: 'unary' },
  { name: '1/x', build: () => invTree(), paperK: 65, kind: 'unary' },
  { name: 'x²', build: () => sqrTree(), paperK: 75, kind: 'unary' },
  { name: 'x+y', build: addTree, paperK: 27, kind: 'binary' },
  { name: 'x×y', build: mulTree, paperK: 41, kind: 'binary' },
  { name: 'x-y', build: subTree, paperK: 83, kind: 'binary' },
  { name: 'x/y', build: divTree, paperK: 105, kind: 'binary' },
];
