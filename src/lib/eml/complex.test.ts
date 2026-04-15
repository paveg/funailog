import { describe, expect, it } from 'vitest';

import { add, cExp, cLn, div, mul, sub, type Complex } from './complex';

const close = (a: number, b: number, tol = 1e-12) =>
  Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

const cEq = (a: Complex, b: Complex, tol = 1e-12) =>
  close(a.re, b.re, tol) && close(a.im, b.im, tol);

describe('Complex arithmetic', () => {
  it('adds two complex numbers', () => {
    expect(add({ re: 1, im: 2 }, { re: 3, im: -1 })).toEqual({ re: 4, im: 1 });
  });

  it('subtracts two complex numbers', () => {
    expect(sub({ re: 5, im: 2 }, { re: 1, im: 3 })).toEqual({ re: 4, im: -1 });
  });

  it('multiplies (a+bi)(c+di) = (ac-bd) + (ad+bc)i', () => {
    const z = mul({ re: 2, im: 3 }, { re: 4, im: -5 });
    expect(cEq(z, { re: 23, im: 2 })).toBe(true);
  });

  it('divides via conjugate', () => {
    const z = div({ re: 1, im: 0 }, { re: 0, im: 1 });
    expect(cEq(z, { re: 0, im: -1 })).toBe(true);
  });
});

describe('cExp', () => {
  it('agrees with Math.exp on the real axis', () => {
    for (const x of [-2, -0.5, 0, 1, 2.5]) {
      const z = cExp({ re: x, im: 0 });
      expect(close(z.re, Math.exp(x))).toBe(true);
      expect(close(z.im, 0)).toBe(true);
    }
  });

  it('computes Euler identity: exp(i*pi) = -1', () => {
    const z = cExp({ re: 0, im: Math.PI });
    expect(close(z.re, -1, 1e-10)).toBe(true);
    expect(close(z.im, 0, 1e-10)).toBe(true);
  });
});

describe('cLn (principal branch)', () => {
  it('agrees with Math.log on positive reals', () => {
    for (const x of [0.1, 1, 2, Math.E, 100]) {
      const z = cLn({ re: x, im: 0 });
      expect(close(z.re, Math.log(x))).toBe(true);
      expect(close(z.im, 0)).toBe(true);
    }
  });

  it('ln(-1) = i*pi (principal branch)', () => {
    const z = cLn({ re: -1, im: 0 });
    expect(close(z.re, 0)).toBe(true);
    expect(close(z.im, Math.PI)).toBe(true);
  });

  it('ln(i) = i*pi/2', () => {
    const z = cLn({ re: 0, im: 1 });
    expect(close(z.re, 0)).toBe(true);
    expect(close(z.im, Math.PI / 2)).toBe(true);
  });

  it('ln and exp are inverse on principal strip', () => {
    const z = { re: 0.7, im: 1.2 };
    const round = cLn(cExp(z));
    expect(cEq(round, z, 1e-12)).toBe(true);
  });
});
