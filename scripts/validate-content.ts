#!/usr/bin/env tsx
/**
 * Blog content validator — catches issues that only surface at build/render time.
 *
 * Checks:
 * 1. Frontmatter schema (required fields, valid category enum, date format)
 * 2. MDX parse errors (syntax issues caught before build)
 * 3. Broken emphasis (** rendered as literal text instead of bold)
 *
 * Usage:
 *   pnpm validate:content                    # All blog MDX files
 *   pnpm validate:content src/content/blog/2026/my-post.mdx  # Specific files
 */

import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';
import { resolve, relative } from 'node:path';

import { parse as parseYAML } from 'yaml';

// ── Frontmatter schema ──────────────────────────────────────────────

const VALID_CATEGORIES = new Set([
  'programming',
  'design',
  'gadgets',
  'travel',
  'lifestyle',
  'vehicles',
  'other',
]);

type FrontmatterError = {
  field: string;
  message: string;
};

function validateFrontmatter(
  data: Record<string, unknown>,
): FrontmatterError[] {
  const errors: FrontmatterError[] = [];

  // Required string fields
  for (const field of ['title', 'description']) {
    if (typeof data[field] !== 'string' || data[field] === '') {
      errors.push({ field, message: `required (string)` });
    }
  }

  // published: required date
  if (data.published == null) {
    errors.push({ field: 'published', message: 'required (date)' });
  } else if (
    !(data.published instanceof Date) &&
    isNaN(Date.parse(String(data.published)))
  ) {
    errors.push({
      field: 'published',
      message: `invalid date: ${data.published}`,
    });
  }

  // isPublished: required boolean
  if (typeof data.isPublished !== 'boolean') {
    errors.push({ field: 'isPublished', message: 'required (boolean)' });
  }

  // category: optional but must be valid enum
  if (data.category != null && !VALID_CATEGORIES.has(String(data.category))) {
    errors.push({
      field: 'category',
      message: `invalid: "${data.category}" (valid: ${[...VALID_CATEGORIES].join(', ')})`,
    });
  }

  // tags: optional but must be string array
  if (data.tags != null) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'must be an array of strings' });
    } else if (data.tags.some((t: unknown) => typeof t !== 'string')) {
      errors.push({ field: 'tags', message: 'all items must be strings' });
    }
  }

  return errors;
}

// ── Frontmatter extraction ──────────────────────────────────────────

function extractFrontmatter(content: string): {
  data: Record<string, unknown> | null;
  body: string;
  error?: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { data: null, body: content, error: 'No frontmatter found' };
  }

  try {
    const data = parseYAML(match[1]) as Record<string, unknown>;
    const body = content.slice(match[0].length).trimStart();
    return { data, body };
  } catch (e) {
    return {
      data: null,
      body: content,
      error: `YAML parse error: ${e instanceof Error ? e.message : e}`,
    };
  }
}

// ── Broken emphasis detection ───────────────────────────────────────

type EmphasisIssue = {
  line: number;
  excerpt: string;
};

async function findBrokenEmphasis(mdxBody: string): Promise<EmphasisIssue[]> {
  const { unified } = await import('unified');
  const remarkParse = (await import('remark-parse')).default;
  const remarkMdx = (await import('remark-mdx')).default;
  const remarkGfm = (await import('remark-gfm')).default;

  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

  let tree;
  try {
    tree = processor.parse(mdxBody);
  } catch {
    // MDX parse errors are reported separately
    return [];
  }

  const issues: EmphasisIssue[] = [];

  function walk(node: {
    type: string;
    value?: string;
    position?: { start: { line: number } };
    children?: unknown[];
  }) {
    if (node.type === 'text' && node.value && /\*{2,}/.test(node.value)) {
      issues.push({
        line: node.position?.start?.line ?? 0,
        excerpt: node.value.trim().slice(0, 80),
      });
    }
    if (node.children) {
      for (const child of node.children) {
        walk(child as typeof node);
      }
    }
  }

  walk(tree as unknown as Parameters<typeof walk>[0]);
  return issues;
}

// ── MDX parse check ─────────────────────────────────────────────────

async function checkMdxParse(mdxBody: string): Promise<string | null> {
  const { unified } = await import('unified');
  const remarkParse = (await import('remark-parse')).default;
  const remarkMdx = (await import('remark-mdx')).default;

  const processor = unified().use(remarkParse).use(remarkMdx);

  try {
    processor.parse(mdxBody);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

// ── Main ────────────────────────────────────────────────────────────

type FileResult = {
  file: string;
  errors: string[];
  warnings: string[];
};

async function validateFile(filePath: string): Promise<FileResult> {
  const rel = relative(process.cwd(), filePath);
  const result: FileResult = { file: rel, errors: [], warnings: [] };

  if (!existsSync(filePath)) {
    result.errors.push('File not found');
    return result;
  }

  const content = readFileSync(filePath, 'utf-8');

  // 1. Frontmatter
  const { data, body, error: fmError } = extractFrontmatter(content);
  if (fmError) {
    result.errors.push(`frontmatter: ${fmError}`);
  }
  if (data) {
    const fmErrors = validateFrontmatter(data);
    for (const e of fmErrors) {
      result.errors.push(`frontmatter.${e.field}: ${e.message}`);
    }
  }

  // 2. MDX parse
  const parseError = await checkMdxParse(body);
  if (parseError) {
    result.errors.push(`MDX parse error: ${parseError}`);
  }

  // 3. Broken emphasis
  const emphasisIssues = await findBrokenEmphasis(body);
  for (const issue of emphasisIssues) {
    result.errors.push(
      `broken emphasis at line ~${issue.line}: literal "**" found in text → "${issue.excerpt}"`,
    );
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);

  let files: string[];
  if (args.length > 0) {
    // Specific files passed as arguments
    files = args.map((f) => resolve(f));
  } else {
    // All blog MDX files
    files = globSync('src/content/blog/**/*.mdx').map((f) => resolve(f));
  }

  if (files.length === 0) {
    console.log('No MDX files to validate.');
    process.exit(0);
  }

  let hasErrors = false;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const result = await validateFile(file);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`\n${result.file}`);
      for (const e of result.errors) {
        console.log(`  ✗ ${e}`);
        hasErrors = true;
      }
      for (const w of result.warnings) {
        console.log(`  ⚠ ${w}`);
      }
    }
  }

  console.log(
    `\nValidated ${files.length} file(s): ${totalErrors} error(s), ${totalWarnings} warning(s)`,
  );

  if (hasErrors) {
    process.exit(1);
  }
}

main();
