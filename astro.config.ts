import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import inline from '@playform/inline';
import embeds from 'astro-embed/integration';
import purgecss from 'astro-purgecss';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMermaid from 'rehype-mermaid';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

import remarkLink from './src/lib/remark-link';
import { remarkReadingTime } from './src/lib/remark-reading-time';

import type { Element } from 'hast';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
      configFile: 'tailwind.config.mjs',
    }),
    embeds({
      services: {
        // Only YouTube is handled by astro-embed
        // Other URLs are handled by our LinkCard component
        LinkPreview: false,
      },
    }),
    mdx(),
    sitemap(),
    purgecss({
      fontFace: true,
      safelist: {
        // Keep all dark mode and prose classes
        standard: [/^dark/, /^prose/, /^shiki/, /^astro-/],
        // Keep radix-ui component classes
        deep: [/radix/, /data-/],
        // Keep Tailwind animation and dynamic classes
        greedy: [/animate-/, /transition-/],
      },
    }),
    inline(),
  ],
  build: {
    // If I set 'file', Astro.url.pathname should return '/file.html'
    format: 'directory',
  },
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  vite: {
    build: {
      // Note: lightningcssでのミニファイは構文エラーが発生するためesbuildを使用
      // 原因: 外部ライブラリまたはrehypeプラグインが生成するCSSに不正な構文あり
      cssMinify: 'esbuild',
    },
    css: {
      lightningcss: {
        drafts: {
          customMedia: true,
        },
      },
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
      rehypeSlug,
      [
        rehypeMermaid,
        {
          // Use pre-mermaid strategy for client-side rendering
          // This avoids Playwright dependency which doesn't work in Cloudflare Workers build
          strategy: 'pre-mermaid',
        },
      ],
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
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light',
            dark: 'github-dark',
          },
          grid: false,
          defaultLang: 'plaintext',
        },
      ],
    ],
  },
  site: 'https://www.funailog.com',
});
