import { type Complex } from './complex';
import { eml, type EMLTree, type Env } from './tree';

export type RpnToken = '1' | 'E' | string; // variable names otherwise

// Postorder serialization: leaves first, then the 'E' (eml) operator.
// Matches paper's convention, e.g. ln(x) → "1,1,x,E,1,E,E".
export const toRpn = (tree: EMLTree): readonly RpnToken[] => {
  switch (tree.kind) {
    case 'const':
      return ['1'];
    case 'var':
      return [tree.name];
    case 'eml':
      return [...toRpn(tree.left), ...toRpn(tree.right), 'E'];
  }
};

export const formatRpn = (tokens: readonly RpnToken[]): string =>
  tokens.join(',');

export class RpnError extends Error {}

// Evaluate an RPN token stream using a stack. Each 'E' pops y then x and
// pushes eml(x, y). '1' pushes the constant 1; anything else is a variable
// looked up in env.
export const evalRpn = (
  tokens: readonly RpnToken[],
  env: Env = {},
): Complex => {
  const stack: Complex[] = [];
  for (const tok of tokens) {
    if (tok === '1') {
      stack.push({ re: 1, im: 0 });
      continue;
    }
    if (tok === 'E') {
      const y = stack.pop();
      const x = stack.pop();
      if (!x || !y) throw new RpnError('Stack underflow on E');
      stack.push(eml(x, y));
      continue;
    }
    const value = env[tok];
    if (!value) throw new RpnError(`Unbound variable: ${tok}`);
    stack.push(value);
  }
  if (stack.length !== 1) {
    throw new RpnError(`Expected 1 value on stack, got ${stack.length}`);
  }
  return stack[0] as Complex;
};
