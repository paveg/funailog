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
    embeds({
      services: {
        // Only YouTube is handled by astro-embed
        // Other URLs are handled by our LinkCard component
        LinkPreview: false,
      },
    }),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      themeCssSelector: (theme) => {
        if (theme.type === 'dark') return '.dark';
        return ':root:not(.dark)';
      },
      // Inline styles to avoid Tailwind v4 Vite plugin parsing EC's generated CSS
      emitExternalStylesheet: false,
      styleOverrides: {
        codeFontFamily: "var(--font-code, 'Fira Code Variable', monospace)",
        codeFontSize: '0.875rem',
        borderRadius: '0.5rem',
      },
    }),
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
    ],
  },
  site: 'https://www.funailog.com',
});
