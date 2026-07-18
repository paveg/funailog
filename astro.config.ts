import { readFileSync } from 'node:fs';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import embeds from 'astro-embed/integration';
import expressiveCode from 'astro-expressive-code';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMermaid from 'rehype-mermaid';
import rehypeSlug from 'rehype-slug';

import rehypeBudoux from './src/lib/rehype-budoux';
import rehypeTableWrapper from './src/lib/rehype-table-wrapper';
import rehypeUnwrapSvgP from './src/lib/rehype-unwrap-svg-p';
import remarkLink from './src/lib/remark-link';
import { remarkReadingTime } from './src/lib/remark-reading-time';
import { getBlogPostLastmod } from './src/lib/sitemap-lastmod';

import type { Element } from 'hast';

function readContent(path: string): string | undefined {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return undefined;
  }
}

// https://astro.build/config
export default defineConfig({
  // Dev server binds to localhost only (Astro default).
  // Do NOT set `server.host: true` without explicit intent — exposing
  // the Vite dev server on 0.0.0.0 lets anyone on the same LAN read
  // arbitrary project files via known Vite CVEs.
  integrations: [
    react(),
    embeds({
      services: {
        // Only YouTube is handled by astro-embed
        // Other URLs are handled by our LinkCard component
        LinkPreview: false,
      },
    }),
    expressiveCode(),
    mdx(),
    sitemap({
      serialize(item) {
        const lastmod = getBlogPostLastmod(item.url, readContent);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  image: {
    // ブログ記事で参照するリモート画像（microCMS 添付・imgix 経由の手動アップロード）を
    // ビルド時最適化の対象にする。未登録のリモートドメインは astro:assets の <Image> で
    // 最適化がスキップされる。
    domains: ['images.microcms-assets.io', 'funailog.imgix.net'],
  },
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'esbuild',
    },
  },
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkRehype: {
      footnoteLabel: 'footnote',
      footnoteBackLabel: '↩',
    },
    remarkPlugins: [remarkLink, remarkReadingTime],
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          // pre-mermaid: client-side rendering, no Playwright dependency
          strategy: 'pre-mermaid',
        },
      ],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties(node: Element) {
            return {
              'aria-labelledby': node.properties.id,
            };
          },
          content: h('span.heading-link-icon', {
            title: 'link',
          }),
        },
      ],
      rehypeUnwrapSvgP,
      rehypeTableWrapper,
      // BudouX <wbr> for headings only: gives phrase-aware wrapping on all
      // browsers (incl. iOS WebKit, where word-break: auto-phrase is ignored).
      // Runs after autolink-headings; <a> is excluded so the # anchor stays atomic.
      [rehypeBudoux, { includeTagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ],
  },
  site: 'https://www.funailog.com',
});
