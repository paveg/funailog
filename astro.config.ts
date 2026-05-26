import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import inline from '@playform/inline';
import tailwindcss from '@tailwindcss/vite';
import embeds from 'astro-embed/integration';
import expressiveCode from 'astro-expressive-code';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMermaid from 'rehype-mermaid';
import rehypeSlug from 'rehype-slug';

import rehypeBudoux from './src/lib/rehype-budoux';
import rehypeUnwrapSvgP from './src/lib/rehype-unwrap-svg-p';
import remarkLink from './src/lib/remark-link';
import { remarkReadingTime } from './src/lib/remark-reading-time';

import type { Element } from 'hast';

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
    sitemap(),
    inline(),
  ],
  build: {
    format: 'directory',
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
          behavior: 'prepend',
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
      rehypeBudoux,
    ],
  },
  site: 'https://www.funailog.com',
});
