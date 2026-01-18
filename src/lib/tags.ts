/**
 * Tag filtering utilities
 * Filters out abstract or meaningless tags
 */

/** Year pattern (2020-2039) */
const YEAR_PATTERN = /^20[2-3]\d$/;

/** Tags that are too abstract or meaningless */
const BLOCKLIST = new Set(['その他', 'other', 'misc', 'etc']);

/**
 * Check if a tag is meaningful
 */
export function isValidTag(tag: string): boolean {
  // Filter year tags
  if (YEAR_PATTERN.test(tag)) return false;

  // Filter blocklisted tags
  if (BLOCKLIST.has(tag.toLowerCase())) return false;

  // Filter very short tags (1 char)
  if (tag.length < 2) return false;

  return true;
}

/**
 * Filter tags to only include meaningful ones
 */
export function filterTags(tags: string[]): string[] {
  return tags.filter(isValidTag);
}
