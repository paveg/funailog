import { cExp, cLn, sub, type Complex } from './complex';

export type EMLTree =
  | { readonly kind: 'const'; readonly value: 1 }
  | { readonly kind: 'var'; readonly name: string }
  | { readonly kind: 'eml'; readonly left: EMLTree; readonly right: EMLTree };

export const c1: EMLTree = { kind: 'const', value: 1 };
export const v = (name: string): EMLTree => ({ kind: 'var', name });
export const e = (left: EMLTree, right: EMLTree): EMLTree => ({
  kind: 'eml',
  left,
  right,
});

// eml(x, y) = exp(x) - ln(y)
export const eml = (x: Complex, y: Complex): Complex => sub(cExp(x), cLn(y));

export type Env = Readonly<Record<string, Complex>>;

export const evaluate = (tree: EMLTree, env: Env = {}): Complex => {
  switch (tree.kind) {
    case 'const':
      return { re: 1, im: 0 };
    case 'var': {
      const value = env[tree.name];
      if (!value) throw new Error(`Unbound variable: ${tree.name}`);
      return value;
    }
    case 'eml':
      return eml(evaluate(tree.left, env), evaluate(tree.right, env));
  }
};

export const depth = (tree: EMLTree): number => {
  if (tree.kind !== 'eml') return 0;
  return 1 + Math.max(depth(tree.left), depth(tree.right));
};

export const nodeCount = (tree: EMLTree): number => {
  if (tree.kind !== 'eml') return 1;
  return 1 + nodeCount(tree.left) + nodeCount(tree.right);
};
