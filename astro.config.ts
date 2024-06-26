import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// TODO: Adopt purgecss but CSS for tailwind is not working properly
// import purgecss from 'astro-purgecss';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

import remarkLink from './src/lib/remark-link';
import { remarkReadingTime } from './src/lib/remark-reading-time';

import type { Element } from 'hast';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
      configFile: 'tailwind.config.mjs',
    }),
    mdx(),
    sitemap(),
    // purgecss({
    //   fontFace: true,
    // }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
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
      cssMinify: 'lightningcss',
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
            light: 'tokyo-night',
            dark: 'tokyo-night',
          },
          grid: false,
          defaultLang: 'plaintext',
        },
      ],
    ],
  },
  site: 'https://www.funailog.com',
});
