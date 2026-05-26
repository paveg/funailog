# Phase 1: Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the design system from scratch — tokens, Storybook, components (AffiliateCard React migration, LinkCard cache), and static analysis — while preserving all existing URLs and content.

**Architecture:** Astro v6 + React 19 + Tailwind v4 static blog. Design tokens in CSS custom properties (`tokens.css`). UI components in `src/components/ui/` (React). Content components (LinkCard) stay as Astro. Storybook (`@storybook/react-vite`) for visual verification. LinkCard metadata cached in JSON to avoid build-time fetches.

**Tech Stack:** Astro 6, React 19, Tailwind CSS 4, Storybook 8 (react-vite), Vitest, class-variance-authority, Radix UI

---

## File Structure

**New files:**

- `.storybook/main.ts` — Storybook configuration
- `.storybook/preview.ts` — Global decorators, dark mode, viewport presets
- `src/components/ui/card.stories.tsx` — Card component stories
- `src/components/ui/badge.stories.tsx` — Badge component stories
- `src/components/ui/button.stories.tsx` — Button component stories
- `src/components/ui/separator.stories.tsx` — Separator component stories
- `src/components/ui/pagination.stories.tsx` — Pagination component stories
- `src/components/AffiliateCard.tsx` — React version of AffiliateCard (new)
- `src/components/AffiliateCard.stories.tsx` — AffiliateCard stories
- `src/components/LinkCardPreview.tsx` — React preview for Storybook
- `src/components/LinkCardPreview.stories.tsx` — LinkCard stories
- `src/data/link-cards.json` — Persistent LinkCard metadata cache
- `src/lib/link-card-cache.ts` — Cache read/write logic
- `src/lib/link-card-cache.test.ts` — Cache logic tests
- `scripts/link-cards.ts` — CLI for cache management

**Modified files:**

- `src/styles/tokens.css` — Add surface/shadow/border tokens
- `src/styles/prose.css` — Add explicit `max-width: 38em`
- `src/lib/api.ts` — Integrate JSON cache lookup before fetch
- `src/components/ui/card.tsx` — Use new surface/shadow tokens
- `package.json` — Add Storybook deps, `link-cards:*` scripts, `storybook` script
- `vitest.config.ts` — Ensure compatibility with new test files
- `.gitignore` — Add `storybook-static/`
- `.markdownlint.jsonc` — Review and update rules

---

### Task 1: Design Tokens Refresh

**Files:**

- Modify: `src/styles/tokens.css`
- Modify: `src/styles/prose.css`

- [ ] **Step 1: Read current tokens.css to understand the structure**

Run: `cat src/styles/tokens.css`

Understand the existing `:root` / `.dark` / `@media (prefers-color-scheme)` structure before adding tokens.

- [ ] **Step 2: Add new surface, shadow, and border tokens to tokens.css**

Add the following custom properties to the light theme block:

```css
--surface-elevated: #fff;
--surface-sunken: #f5f6f8;
--border-elevated: transparent;
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
```

And in the dark theme block:

```css
--surface-elevated: #1a1a24;
--surface-sunken: #0d0d12;
--border-elevated: rgba(255, 255, 255, 0.06);
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
```

- [ ] **Step 3: Add explicit max-width to prose.css**

Add `max-width: 38em` to the article prose container if not already present. This enforces jp-ui-contracts' 35–40 character line length for Japanese body text.

- [ ] **Step 4: Verify the build still works**

Run: `pnpm build`
Expected: Build succeeds with no errors. Existing pages render unchanged (new tokens are additive).

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/prose.css
git commit -m "feat(tokens): add surface, shadow, and border tokens for Adaptive Duo-tone"
```

---

### Task 2: Storybook Setup

**Files:**

- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install Storybook dependencies**

```bash
pnpm add -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-viewport @storybook/blocks storybook storybook-dark-mode
```

- [ ] **Step 2: Create `.storybook/main.ts`**

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-viewport',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    config.plugins = [...(config.plugins || []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': new URL('../src', import.meta.url).pathname,
      },
    };
    return config;
  },
};

export default config;
```

- [ ] **Step 3: Create `.storybook/preview.ts`**

```typescript
import '../src/styles/tokens.css';
import '@fontsource/line-seed-jp/400.css';
import '@fontsource/line-seed-jp/700.css';
import '@fontsource-variable/fira-code';

import type { Preview } from '@storybook/react';

const VIEWPORTS = {
  mobile: { name: 'Mobile (375px)', styles: { width: '375px', height: '812px' } },
  tablet: { name: 'Tablet (768px)', styles: { width: '768px', height: '1024px' } },
  desktop: { name: 'Desktop (1280px)', styles: { width: '1280px', height: '900px' } },
};

const preview: Preview = {
  parameters: {
    viewport: { viewports: VIEWPORTS, defaultViewport: 'desktop' },
    darkMode: {
      darkClass: 'dark',
      lightClass: '',
      stylePreview: true,
      classTarget: 'html',
    },
  },
};

export default preview;
```

- [ ] **Step 4: Add scripts to package.json**

Add to `"scripts"`:

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

- [ ] **Step 5: Add `storybook-static/` to .gitignore**

Append `storybook-static/` to `.gitignore`.

- [ ] **Step 6: Verify Storybook launches**

Run: `pnpm storybook`
Expected: Storybook opens at `http://localhost:6006` with no stories yet. Dark mode toggle is visible in the toolbar. Close it after confirming.

- [ ] **Step 7: Commit**

```bash
git add .storybook/ package.json pnpm-lock.yaml .gitignore
git commit -m "feat(storybook): add Storybook 8 with dark mode and viewport addons"
```

---

### Task 3: Card Component Story

**Files:**

- Create: `src/components/ui/card.stories.tsx`
- Modify: `src/components/ui/card.tsx` (update to use new tokens)

- [ ] **Step 1: Update Card to use new surface/shadow tokens**

In `src/components/ui/card.tsx`, replace the hardcoded shadow classes with the new token-based approach:

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border text-card-foreground transition-shadow duration-200',
      'bg-[var(--surface-elevated)] border-[var(--border-elevated)]',
      'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      className,
    )}
    {...props}
  />
));
```

- [ ] **Step 2: Create Card stories**

Create `src/components/ui/card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>DELL U4025QW</CardTitle>
        <CardDescription>5K2K 40インチウルトラワイドモニター</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          2年間使用した長期レビュー。開発・映像・ブログ執筆のすべてに対応する実用性。
        </p>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">Gadgets</Badge>
      </CardFooter>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>シンプルなカード</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">コンテンツのみ</p>
      </CardContent>
    </Card>
  ),
};
```

- [ ] **Step 3: Verify in Storybook — 6 patterns**

Run: `pnpm storybook`

Check the Card component in all 6 combinations:

1. Light + Mobile (375px)
2. Light + Tablet (768px)
3. Light + Desktop (1280px)
4. Dark + Mobile (375px)
5. Dark + Tablet (768px)
6. Dark + Desktop (1280px)

Expected: Card shows elevated surface with subtle shadow in light mode, subtle border in dark mode. No visual regressions.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/card.tsx src/components/ui/card.stories.tsx
git commit -m "feat(card): use design tokens and add Storybook stories"
```

---

### Task 4: Badge Component Story

**Files:**

- Create: `src/components/ui/badge.stories.tsx`

- [ ] **Step 1: Create Badge stories**

Create `src/components/ui/badge.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'tech', 'project'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'programming' } };
export const Secondary: Story = { args: { children: 'gadgets', variant: 'secondary' } };
export const Outline: Story = { args: { children: 'PR', variant: 'outline' } };
export const Tech: Story = { args: { children: 'TypeScript', variant: 'tech' } };
export const Project: Story = { args: { children: 'funailog', variant: 'project' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>default</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="tech">tech</Badge>
      <Badge variant="project">project</Badge>
    </div>
  ),
};
```

- [ ] **Step 2: Verify in Storybook — 6 patterns**

Run: `pnpm storybook`
Check all Badge variants in light/dark x 3 widths. Verify contrast ratios are acceptable and text is readable.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/badge.stories.tsx
git commit -m "feat(badge): add Storybook stories for all variants"
```

---

### Task 5: Button, Separator, and Pagination Stories

**Files:**

- Create: `src/components/ui/button.stories.tsx`
- Create: `src/components/ui/separator.stories.tsx`
- Create: `src/components/ui/pagination.stories.tsx`

- [ ] **Step 1: Read current button.tsx and separator.tsx**

Run: `cat src/components/ui/button.tsx src/components/ui/separator.tsx`

Understand the existing variants and props before writing stories.

- [ ] **Step 2: Create Button stories**

Create `src/components/ui/button.stories.tsx` with stories for each variant (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and each size. Include an `AllVariants` story showing all variants side by side.

- [ ] **Step 3: Create Separator stories**

Create `src/components/ui/separator.stories.tsx` with horizontal and vertical orientation stories.

- [ ] **Step 4: Create Pagination stories**

Read `src/components/ui/pagination.tsx` first. Create `src/components/ui/pagination.stories.tsx` with stories for: default state, first page, last page, many pages. Show both mobile (compact) and desktop views.

- [ ] **Step 5: Verify in Storybook — 6 patterns**

Run: `pnpm storybook`
Check all three components in all 6 combinations.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/button.stories.tsx src/components/ui/separator.stories.tsx src/components/ui/pagination.stories.tsx
git commit -m "feat(ui): add Button, Separator, and Pagination Storybook stories"
```

---

### Task 6: LinkCard Hybrid Cache — Core Logic

**Files:**

- Create: `src/lib/link-card-cache.ts`
- Create: `src/lib/link-card-cache.test.ts`
- Create: `src/data/link-cards.json`

- [ ] **Step 1: Write failing test for cache read (cache hit)**

Create `src/lib/link-card-cache.test.ts`:

```typescript
import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';

import { readCache, writeCache, type LinkCardEntry } from './link-card-cache';

vi.mock('fs');

describe('link-card-cache', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns cached entry when URL exists in cache', () => {
    const cache: Record<string, LinkCardEntry> = {
      'https://example.com': {
        title: 'Example',
        description: 'Desc',
        image: '/.cache/embed/abc.avif',
        fetchedAt: '2026-05-27T00:00:00Z',
      },
    };
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(cache));
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const result = readCache('https://example.com');
    expect(result).toEqual(cache['https://example.com']);
  });

  it('returns undefined for cache miss', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('{}');
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const result = readCache('https://notcached.com');
    expect(result).toBeUndefined();
  });

  it('returns undefined when cache file does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const result = readCache('https://example.com');
    expect(result).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/link-card-cache.test.ts`
Expected: FAIL — module `./link-card-cache` not found.

- [ ] **Step 3: Implement link-card-cache.ts**

Create `src/lib/link-card-cache.ts`:

```typescript
import fs from 'fs';
import path from 'path';

export interface LinkCardEntry {
  title: string;
  description: string;
  image: string | undefined;
  fetchedAt: string;
}

const CACHE_PATH = path.join(process.cwd(), 'src/data/link-cards.json');

let memoryCache: Record<string, LinkCardEntry> | null = null;

const loadCache = (): Record<string, LinkCardEntry> => {
  if (memoryCache) return memoryCache;
  if (!fs.existsSync(CACHE_PATH)) return {};
  const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
  memoryCache = JSON.parse(raw) as Record<string, LinkCardEntry>;
  return memoryCache;
};

export const readCache = (url: string): LinkCardEntry | undefined => {
  return loadCache()[url];
};

export const writeCache = (url: string, entry: LinkCardEntry): void => {
  const cache = loadCache();
  cache[url] = entry;
  memoryCache = cache;
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
};

export const getAllCacheEntries = (): Record<string, LinkCardEntry> => {
  return { ...loadCache() };
};

export const deleteEntry = (url: string): boolean => {
  const cache = loadCache();
  if (!(url in cache)) return false;
  delete cache[url];
  memoryCache = cache;
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
  return true;
};

export const resetMemoryCache = (): void => {
  memoryCache = null;
};
```

- [ ] **Step 4: Create initial empty cache file**

Create `src/data/link-cards.json`:

```json
{}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/link-card-cache.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/link-card-cache.ts src/lib/link-card-cache.test.ts src/data/link-cards.json
git commit -m "feat(link-card): add persistent JSON cache with read/write logic"
```

---

### Task 7: LinkCard Cache — Integration with api.ts

**Files:**

- Modify: `src/lib/api.ts`
- Modify: `src/lib/api.test.ts` (add cache tests)

- [ ] **Step 1: Write failing integration test**

Add to `src/lib/api.test.ts` a new describe block:

```typescript
describe('fetchLinkCard with JSON cache', () => {
  it('returns cached data without calling fetch-site-metadata', async () => {
    // Mock the cache module to return a hit
    vi.doMock('./link-card-cache', () => ({
      readCache: vi.fn(() => ({
        title: 'Cached Title',
        description: 'Cached Desc',
        image: '/.cache/embed/cached.avif',
        fetchedAt: '2026-05-27T00:00:00Z',
      })),
      writeCache: vi.fn(),
    }));

    // Re-import to get mocked version
    const { fetchLinkCard: cachedFetch } = await import('./api');
    const result = await cachedFetch('https://cached-example.com');

    expect(result.title).toBe('Cached Title');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/api.test.ts`
Expected: FAIL — fetchLinkCard does not consult the cache yet.

- [ ] **Step 3: Integrate cache into fetchLinkCard in api.ts**

Modify `src/lib/api.ts`: at the top, import the cache module. In `fetchLinkCard`, check cache before calling `siteMetadata`:

```typescript
import { readCache, writeCache } from './link-card-cache';

export const fetchLinkCard = async (href: string) => {
  const cached = readCache(href);
  if (cached) {
    return {
      description: cached.description,
      image: { src: cached.image },
      title: cached.title,
    };
  }

  const { description, image, title } = await siteMetadata(href);
  const ogImage = image?.src ? await fetchSiteImage(image.src) : undefined;

  if (title && title !== 'Not found') {
    writeCache(href, {
      title: title || '',
      description: description || '',
      image: ogImage,
      fetchedAt: new Date().toISOString(),
    });
  }

  return { description, image: { src: ogImage }, title };
};
```

- [ ] **Step 4: Run all api tests**

Run: `pnpm vitest run src/lib/api.test.ts`
Expected: All tests PASS (existing SSRF tests + new cache test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts src/lib/api.test.ts
git commit -m "feat(link-card): integrate JSON cache into fetchLinkCard"
```

---

### Task 8: LinkCard Cache — CLI Scripts

**Files:**

- Create: `scripts/link-cards.ts`
- Modify: `package.json`

- [ ] **Step 1: Create CLI script**

Create `scripts/link-cards.ts` with `update` and `clean` subcommands.

`update`: Scans all MDX files for bare URLs (lines that are solely `https://...`), then calls `fetchLinkCard` for each. With `--url=<URL>`, updates only that single entry.

`clean`: Compares cache entries against URLs found in MDX. Removes entries for URLs no longer referenced.

The script reads MDX files with `fs.readFileSync` and uses a simple regex `^(https?://[^\s)]+)$` (multiline) to extract bare URLs.

- [ ] **Step 2: Add scripts to package.json**

Add to `"scripts"`:

```json
"link-cards:update": "tsx scripts/link-cards.ts update",
"link-cards:clean": "tsx scripts/link-cards.ts clean"
```

- [ ] **Step 3: Test the update command with a single URL**

Run: `pnpm link-cards:update --url=https://www.google.com`
Expected: Fetches metadata, writes to `src/data/link-cards.json`. Verify the JSON file now has one entry.

- [ ] **Step 4: Commit**

```bash
git add scripts/link-cards.ts package.json
git commit -m "feat(link-card): add CLI for cache update and cleanup"
```

---

### Task 9: AffiliateCard React Migration

**Files:**

- Create: `src/components/AffiliateCard.tsx`
- Create: `src/components/AffiliateCard.stories.tsx`

- [ ] **Step 1: Create React AffiliateCard with variant support**

Create `src/components/AffiliateCard.tsx`. Port the existing Astro component to React, adding `variant` prop (`'default' | 'inline' | 'compact'`). The `inline` variant uses `surface-elevated` token, minimal elevation, and subdued purchase buttons. Keep the same `AffiliateLink` interface.

Key differences from the Astro version:

- `variant` prop defaults to `'inline'`
- `associateId` passed as a prop (no `getEntry` in React — the MDX or Astro wrapper provides it)
- BudouX wrapping removed (handled by the rehype plugin globally)
- Uses `surface-elevated` and `shadow-sm` tokens for the card container
- `inline` variant: product info is flush with article text, purchase links are small pill buttons
- `compact` variant: single row, image + title + button, for lists of products

- [ ] **Step 2: Create AffiliateCard stories**

Create `src/components/AffiliateCard.stories.tsx` with stories for:

- `Inline` (default) — single product with Amazon + Rakuten links
- `Default` — legacy layout for backward compatibility
- `Compact` — minimal single-row layout
- `NoImage` — product without image
- `SingleService` — only Amazon link
- `AllServices` — Amazon + Rakuten + Yahoo! + other

Each story should use realistic product data (e.g., DELL U4025QW, MX Ergo).

- [ ] **Step 3: Verify in Storybook — 6 patterns per variant**

Run: `pnpm storybook`

Check all 3 variants in 6 patterns = 18 combinations. Key checks:

- `inline`: card blends with surrounding text, PR badge is subtle, purchase buttons are pill-shaped
- `default`: matches original Astro layout
- `compact`: single row, image left, info center, button right
- Mobile: `inline` and `default` stack vertically. `compact` wraps gracefully
- Dark mode: all variants use `surface-elevated` token correctly

- [ ] **Step 4: Update existing MDX import path (if needed)**

Check which MDX files import `AffiliateCard`. If they use the Astro version via auto-import, the Astro component file stays in place and delegates to the React component. Alternatively, update the MDX imports.

- [ ] **Step 5: Commit**

```bash
git add src/components/AffiliateCard.tsx src/components/AffiliateCard.stories.tsx
git commit -m "feat(affiliate): React AffiliateCard with inline/default/compact variants"
```

---

### Task 10: LinkCard Storybook Preview

**Files:**

- Create: `src/components/LinkCardPreview.tsx`
- Create: `src/components/LinkCardPreview.stories.tsx`

- [ ] **Step 1: Create React preview component**

Create `src/components/LinkCardPreview.tsx` — a React component that replicates the visual output of `LinkCard.astro` for Storybook purposes. It does not fetch data; it accepts title, hostname, and faviconUrl as props.

```tsx
import React from 'react';

import { cn } from '@/lib/utils';

interface LinkCardPreviewProps {
  href: string;
  title: string;
  hostname: string;
  faviconUrl?: string;
  isExternal?: boolean;
}

export const LinkCardPreview: React.FC<LinkCardPreviewProps> = ({
  href,
  title,
  hostname,
  faviconUrl,
  isExternal = true,
}) => (
  <a
    href={href}
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
    className="not-prose group my-3 block"
  >
    <span
      className={cn(
        'flex items-center gap-2.5 overflow-hidden rounded border px-3 py-2 leading-none',
        'transition-all duration-200',
        'bg-[var(--surface-elevated)] border-[var(--border-elevated)]',
        'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      )}
    >
      {faviconUrl && (
        <img
          src={faviconUrl}
          alt=""
          width="16"
          height="16"
          className="m-0 size-4 shrink-0 rounded-sm opacity-50 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
        />
      )}
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="text-foreground group-hover:text-link truncate text-xs font-medium transition-colors duration-150">
          {title}
        </span>
        <span className="font-code text-2xs text-muted-foreground/50 shrink-0">
          {hostname}
        </span>
      </span>
      {isExternal && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground/30 group-hover:text-muted-foreground/70 size-3 shrink-0 transition-all duration-150 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      )}
    </span>
  </a>
);
```

- [ ] **Step 2: Create LinkCardPreview stories**

Create `src/components/LinkCardPreview.stories.tsx` with stories for:

- External link (default)
- Internal link (no external icon)
- Long title (truncation)
- Multiple cards in sequence

- [ ] **Step 3: Verify in Storybook — 6 patterns**

Run: `pnpm storybook`
Check that LinkCard uses the new surface/shadow tokens. Verify truncation at mobile width.

- [ ] **Step 4: Commit**

```bash
git add src/components/LinkCardPreview.tsx src/components/LinkCardPreview.stories.tsx
git commit -m "feat(link-card): add React preview component for Storybook"
```

---

### Task 11: Static Analysis Review

**Files:**

- Modify: `.markdownlint.jsonc`
- Modify: `package.json` (lint scripts if needed)

- [ ] **Step 1: Audit current markdownlint config**

Review `.markdownlint.jsonc` for rules that may conflict with the new design docs or cause friction with Japanese content. Check if MD060 (table column style) needs adjustment for docs that contain Japanese tables.

- [ ] **Step 2: Review textlint configuration**

Run: `cat .textlintrc.json` or similar. Ensure the AI writing preset still covers the blog content and the new docs do not interfere.

- [ ] **Step 3: Verify all linting passes**

Run: `pnpm lint`
Expected: All checks pass (format, ESLint, markdownlint, textlint, astro check).

- [ ] **Step 4: Fix any issues found**

If lint errors arise from new files (Storybook stories, cache module, etc.), fix them.

- [ ] **Step 5: Commit**

```bash
git add .markdownlint.jsonc package.json
git commit -m "chore(lint): update static analysis config for design system files"
```

---

### Task 12: Full Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run the complete build**

Run: `pnpm build`
Expected: Build succeeds. All 41 blog posts render. URL structure unchanged.

- [ ] **Step 2: Run all tests**

Run: `pnpm test`
Expected: All tests pass including new link-card-cache tests.

- [ ] **Step 3: Run linting**

Run: `pnpm lint`
Expected: All checks pass.

- [ ] **Step 4: Preview the site**

Run: `pnpm preview`
Spot-check:

- Home page loads
- A blog post with LinkCards displays correctly (e.g., `/blog/2025/modern-edge-tech-stack`)
- A blog post with AffiliateCard displays correctly
- Dark mode toggle works
- Mobile viewport (browser dev tools) looks correct

- [ ] **Step 5: Final commit if needed**

If any fixes were required during verification, commit them.
