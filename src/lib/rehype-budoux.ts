import { loadDefaultJapaneseParser } from 'budoux';
import { h } from 'hastscript';
import { visitParents } from 'unist-util-visit-parents';

import type { HTMLProcessingParser } from 'budoux';
import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';

interface Options {
  excludeTagNames?: string[];
}

const defaultExcludeTagNames = ['pre', 'code', 'a'];

let parser: HTMLProcessingParser | null = null;

const rehypeBudoux: Plugin<[Options?], Root> = ({
  excludeTagNames = defaultExcludeTagNames,
}: Options = {}) => {
  return (tree) => {
    visitParents(tree, 'text', (node, ancestors) => {
      const parent = ancestors[ancestors.length - 1];
      const index = parent
        ? (parent as Element).children?.indexOf(node)
        : undefined;
      if (
        index === undefined ||
        index === -1 ||
        !parent ||
        parent.type !== 'element' ||
        excludeTagNames.includes((parent as Element).tagName) ||
        ancestors.some(
          (a): a is Element =>
            a.type === 'element' &&
            excludeTagNames.includes((a as Element).tagName),
        ) ||
        node.value.trim().length === 0
      ) {
        return;
      }

      parser ??= loadDefaultJapaneseParser();

      const segments = parser.parse(node.value);
      if (segments.length <= 1) {
        return;
      }

      const replacement = segments.flatMap((value, i) => [
        ...(i > 0 ? [h('wbr')] : []),
        { type: 'text' as const, value },
      ]);

      parent.children.splice(index, 1, ...replacement);

      parent.properties = {
        ...parent.properties,
        dataBudoux: true,
      };
    });
  };
};

export default rehypeBudoux;
