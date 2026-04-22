import { visitParents } from 'unist-util-visit-parents';

import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';

// SVG JSX elements whose direct children MDX may wrap in <p> when the
// author's source has the content on its own line (which prettier enforces).
// <p> is invalid inside these, so browsers silently refuse to render them.
// We unwrap the <p>, promoting its children to the SVG element.
const SVG_JSX_TAGS = new Set([
  'svg',
  'text',
  'tspan',
  'title',
  'desc',
  'g',
  'defs',
]);

type JsxLike = { type: string; name?: string | null };

const isSvgJsxParent = (node: JsxLike | undefined): boolean =>
  !!node &&
  (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
  typeof node.name === 'string' &&
  SVG_JSX_TAGS.has(node.name);

const rehypeUnwrapSvgP: Plugin<[], Root> = () => {
  return (tree) => {
    const targets: Array<{
      parent: { children: unknown[] };
      index: number;
      children: unknown[];
    }> = [];

    visitParents(tree, 'element', (node: Element, ancestors) => {
      if (node.tagName !== 'p') return;
      const parent = ancestors[ancestors.length - 1] as JsxLike | undefined;
      if (!isSvgJsxParent(parent)) return;

      const parentWithChildren = parent as unknown as { children: unknown[] };
      const index = parentWithChildren.children.indexOf(node);
      if (index === -1) return;

      targets.push({
        parent: parentWithChildren,
        index,
        children: node.children,
      });
    });

    // Reverse order so earlier splices don't invalidate later indexes.
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      if (!target) continue;
      target.parent.children.splice(target.index, 1, ...target.children);
    }
  };
};

export default rehypeUnwrapSvgP;
