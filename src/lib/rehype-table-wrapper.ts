import { visitParents } from 'unist-util-visit-parents';

import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';

const rehypeTableWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visitParents(tree, 'element', (node, ancestors) => {
      if ((node as Element).tagName !== 'table') return;

      const parent = ancestors[ancestors.length - 1] as Element & {
        children: (Element | { type: string })[];
      };
      if (!parent?.children) return;

      const idx = parent.children.indexOf(node);
      if (idx === -1) return;

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrapper'] },
        children: [node as Element],
      };

      parent.children[idx] = wrapper;
    });
  };
};

export default rehypeTableWrapper;
