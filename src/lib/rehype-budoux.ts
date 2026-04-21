import { loadDefaultJapaneseParser } from 'budoux';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

import type { HTMLProcessingParser } from 'budoux';
import type { Root } from 'hast';
import type { Plugin } from 'unified';

interface Options {
  excludeTagNames?: string[];
}

const defaultExcludeTagNames = ['pre', 'code'];

let parser: HTMLProcessingParser | null = null;

const rehypeBudoux: Plugin<[Options?], Root> = ({
  excludeTagNames = defaultExcludeTagNames,
}: Options = {}) => {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (
        index === undefined ||
        !parent ||
        parent.type !== 'element' ||
        excludeTagNames.includes(parent.tagName) ||
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
