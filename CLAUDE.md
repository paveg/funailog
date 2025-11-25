# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Type check (astro check) then build
pnpm lint         # Format, ESLint, astro check, and tsc --noEmit
pnpm lint:fix     # Auto-fix ESLint issues
pnpm format       # Prettier formatting
pnpm check        # Run astro check only
```

## Architecture

This is an **Astro static blog** (funailog.com) with React components and MDX content.

### Content Structure

- **Blog posts**: `src/content/blog/{lang}/{year}/*.mdx` (ja = default, en = English)
- **Static pages**: `src/content/page/*.mdx` (about, privacy)
- **Site metadata**: `src/content/site/meta.yml`

Blog frontmatter requires: `title`, `description`, `published` (date), `isPublished` (boolean)
Categories: `programming`, `design`, `gadgets`, `travel`, `lifestyle`, `vehicles`, `other`

### i18n

- Default language is Japanese (`ja`), `showDefaultLang = false` means Japanese URLs have no prefix
- English content uses `/en/` prefix in URLs
- Translations in `src/i18n/ui.ts`, utilities in `src/i18n/utils.ts`

### Key Patterns

- **Path alias**: `@/` maps to `src/`
- **Link cards**: Bare URLs in MDX automatically become rich link cards via custom remark plugin (`src/lib/remark-link.ts`)
- **Link card images**: Cached as AVIF in `public/.cache/embed/` with SHA256 hash filenames
- **Dark mode**: Uses `localStorage.getItem('theme')` with `document.documentElement.classList.add('dark')`
- **JSON-LD**: Article structured data generated via `src/lib/rich-results.ts`

### Import Order (enforced by ESLint)

Imports must be ordered: builtin → external → internal → parent → sibling → index → object → type
With newlines between groups and alphabetized within groups.
