export type Complex = { re: number; im: number };

export const c = (re: number, im = 0): Complex => ({ re, im });

export const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const sub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const div = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / d,
    im: (a.im * b.re - a.re * b.im) / d,
  };
};

// Short-circuit the real axis to avoid Inf * sin(0) = NaN when z.re = ±Inf.
// This matters for compiler-generated trees that legitimately pass through
// exp(±Inf) as an intermediate (cf. paper §4.1 on log(0) handling).
export const cExp = (z: Complex): Complex => {
  if (z.im === 0) return { re: Math.exp(z.re), im: 0 };
  const r = Math.exp(z.re);
  return { re: r * Math.cos(z.im), im: r * Math.sin(z.im) };
};

// Principal branch: Im(cLn) ∈ (-π, π].
// On the negative real axis we return +π (upper-half convention, matches Math.atan2).
export const cLn = (z: Complex): Complex => ({
  re: 0.5 * Math.log(z.re * z.re + z.im * z.im),
  im: Math.atan2(z.im, z.re),
});
