import { describe, it, expect } from 'vitest';

import rehypeUnwrapSvgP from './rehype-unwrap-svg-p';

import type { Root } from 'hast';

// Build a minimal tree with an mdxJsxFlowElement (what @mdx-js/mdx emits for
// author-written <svg> / <text> JSX) whose direct child is a <p> wrapping
// Japanese text. This mirrors what MDX produces when the author's source
// has text content on its own line (enforced by prettier).
function buildTree(svgTag: string): Root {
  return {
    type: 'root',
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: svgTag,
        attributes: [],
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              { type: 'text', value: '日常会話での他者ラベリング許容度' },
            ],
          },
        ],
      },
    ],
  } as unknown as Root;
}

function runPlugin(tree: Root): Root {
  const transformer = rehypeUnwrapSvgP.call(null as never) as unknown as (
    t: Root,
  ) => void;
  transformer(tree);
  return tree;
}

describe('rehypeUnwrapSvgP', () => {
  it('unwraps <p> inside <text>', () => {
    const tree = buildTree('text');
    runPlugin(tree);
    const textEl = (tree.children[0] as unknown as { children: unknown[] })
      .children;
    // <p> gone, text node promoted directly under the JSX element
    const first = textEl[0] as { type: string; value?: string };
    expect(first.type).toBe('text');
    expect(first.value).toBe('日常会話での他者ラベリング許容度');
  });

  it('unwraps <p> inside <desc>', () => {
    const tree = buildTree('desc');
    runPlugin(tree);
    const descEl = (tree.children[0] as unknown as { children: unknown[] })
      .children;
    const first = descEl[0] as { type: string };
    expect(first.type).toBe('text');
  });

  it('leaves <p> alone when not under SVG JSX', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [{ type: 'text', value: '普通の段落' }],
            },
          ],
        },
      ],
    };
    runPlugin(tree);
    const divChildren = (tree.children[0] as unknown as { children: unknown[] })
      .children;
    const first = divChildren[0] as { type: string; tagName?: string };
    expect(first.type).toBe('element');
    expect(first.tagName).toBe('p');
  });
});
