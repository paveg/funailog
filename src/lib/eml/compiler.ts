// Port of EML compiler primitives from SymbolicRegressionPackage
// (https://github.com/VA00/SymbolicRegressionPackage, eml_compiler_v4.py).
// Each builder mirrors the reference Python 1:1 so the resulting EML tree
// and its nodeCount reproduces Table 4 "EML Compiler" column values.

import { c1, e, v, type EMLTree } from './tree';

// exp(z) = EML[z, 1]
export const compExp = (z: EMLTree): EMLTree => e(z, c1);

// log(z) = EML[1, EML[EML[1, z], 1]]
export const compLog = (z: EMLTree): EMLTree => e(c1, compExp(e(c1, z)));

// 0 = log(1)
export const compZero = (): EMLTree => compLog(c1);

// a - b = EML[log(a), exp(b)]
export const compSub = (a: EMLTree, b: EMLTree): EMLTree =>
  e(compLog(a), compExp(b));

// -z = 0 - z
export const compNeg = (z: EMLTree): EMLTree => compSub(compZero(), z);

// Clean variant that avoids log(0) in intermediate evaluation (paper 4.1).
// -z = 1 - (1 + z), where 1+z is built via e - (e-1 - z).
// Matches eml_compiler_clean_math_v0.py.
export const compNegClean = (z: EMLTree): EMLTree => {
  const E_ = compExp(c1);
  const eMinusOne = compSub(E_, c1);
  const onePlusZ = compSub(E_, compSub(eMinusOne, z));
  return compSub(c1, onePlusZ);
};

// a + b = a - (-b)
export const compAdd = (a: EMLTree, b: EMLTree): EMLTree =>
  compSub(a, compNeg(b));

// 1/z = exp(-log(z))
export const compInv = (z: EMLTree): EMLTree => compExp(compNeg(compLog(z)));

// a * b = exp(log(a) + log(b))
export const compMul = (a: EMLTree, b: EMLTree): EMLTree =>
  compExp(compAdd(compLog(a), compLog(b)));

// a / b = a * (1/b)
export const compDiv = (a: EMLTree, b: EMLTree): EMLTree =>
  compMul(a, compInv(b));

// a^b = exp(b * log(a))
export const compPow = (a: EMLTree, b: EMLTree): EMLTree =>
  compExp(compMul(b, compLog(a)));

// Integer n via binary exponentiation of successive doublings,
// matching eml_int in the reference Python.
export const compInt = (n: number): EMLTree => {
  if (!Number.isInteger(n)) throw new Error(`compInt requires integer: ${n}`);
  if (n === 1) return c1;
  if (n === 0) return compZero();
  if (n < 0) return compNeg(compInt(-n));
  let acc: EMLTree | null = null;
  let term: EMLTree = c1;
  let k = n;
  while (k > 0) {
    if (k & 1) acc = acc === null ? term : compAdd(acc, term);
    term = compAdd(term, term);
    k >>= 1;
  }
  if (acc === null) throw new Error('unreachable');
  return acc;
};

// Variable leaf shorthand.
export const X = v('x');
export const Y = v('y');
