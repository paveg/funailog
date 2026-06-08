import { loadDefaultJapaneseParser } from 'budoux';
import { h } from 'hastscript';
import { visitParents } from 'unist-util-visit-parents';

import type { HTMLProcessingParser } from 'budoux';
import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';

interface Options {
  excludeTagNames?: string[];
  /**
   * When set, only segment text whose ancestor chain contains one of these
   * tag names (e.g. ['h1','h2',...] to limit BudouX to headings). When unset,
   * all text outside excludeTagNames is segmented.
   */
  includeTagNames?: string[];
}

const defaultExcludeTagNames = ['pre', 'code', 'a', 'svg'];

// Matches both regular hast elements and MDX JSX elements. MDX preserves
// author-written JSX (e.g. inline <svg>) as mdxJsxFlowElement /
// mdxJsxTextElement nodes at the rehype stage, so a raw tagName check misses
// them. BudouX must skip anything inside <svg>, otherwise it wraps SVG
// <text> content in <p> and emits invalid SVG that browsers don't render.
const matchesExcluded = (
  node: { type: string; tagName?: string; name?: string | null },
  names: string[],
): boolean => {
  if (node.type === 'element' && typeof node.tagName === 'string') {
    return names.includes(node.tagName);
  }
  if (
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    typeof node.name === 'string'
  ) {
    return names.includes(node.name);
  }
  return false;
};

let parser: HTMLProcessingParser | null = null;

const rehypeBudoux: Plugin<[Options?], Root> = ({
  excludeTagNames = defaultExcludeTagNames,
  includeTagNames,
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
        matchesExcluded(parent, excludeTagNames) ||
        ancestors.some((a) => matchesExcluded(a, excludeTagNames)) ||
        (includeTagNames !== undefined &&
          !ancestors.some((a) => matchesExcluded(a, includeTagNames))) ||
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
