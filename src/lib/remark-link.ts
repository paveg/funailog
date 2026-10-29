import { visit } from 'unist-util-visit';

import {
  isParent,
  isBareLink,
  isFootnoteDefinition,
} from './mdast-util-node-is';

import type { Root } from 'mdast';
// LinkData に hProperties を足す型拡張を読み込む。
import type {} from 'mdast-util-to-hast';
import type { Plugin } from 'unified';
import type { Parent } from 'unist';

const remarkLinkcard: Plugin<void[], Root> = () => {
  return (tree) => {
    visit(tree, isBareLink, (node, _index, parent: Parent | undefined) => {
      if (!isParent(parent)) {
        return;
      }

      if (parent.type === 'listItem' || isFootnoteDefinition(parent)) {
        return;
      }

      const child = node.children[0];

      if (!child.url.startsWith('http')) {
        return;
      }

      // Skip YouTube links - handled by astro-embed integration
      if (child.url.includes('youtube') || child.url.includes('youtu.be')) {
        return;
      }

      child.data = {
        ...child.data,
        hProperties: {
          ...child.data?.hProperties,
          dataLinkcard: true,
        },
      };
    });
  };
};

export default remarkLinkcard;
