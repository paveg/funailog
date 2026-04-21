import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { describe, it, expect } from 'vitest';

import rehypeBudoux from './rehype-budoux';

async function process(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeBudoux)
    .use(rehypeStringify)
    .process(html);
  return String(file);
}

describe('rehypeBudoux', () => {
  it('inserts <wbr> into plain Japanese paragraphs', async () => {
    const output = await process('<p>今日はいい天気ですね。</p>');
    expect(output).toContain('<wbr>');
    expect(output).toContain('data-budoux');
  });

  it('does not insert <wbr> inside <pre> or <code>', async () => {
    const output = await process(
      '<pre>今日はいい天気ですね。</pre><code>今日はいい天気ですね。</code>',
    );
    expect(output).not.toContain('<wbr>');
  });

  it('does not insert <wbr> inside <a> (keeps links atomic)', async () => {
    const output = await process(
      '<p>まずは<a href="https://example.com">公式ドキュメントを読みます</a>の続き。</p>',
    );
    // The surrounding <p> should still be segmented
    expect(output).toContain('data-budoux');
    // But the <a> content must not contain <wbr>
    const anchorMatch = output.match(/<a[^>]*>([^<]*(?:<(?!\/a>)[^<]*)*)<\/a>/);
    expect(anchorMatch).not.toBeNull();
    const anchorInner = anchorMatch![1];
    expect(anchorInner).not.toContain('<wbr>');
    expect(anchorInner).toBe('公式ドキュメントを読みます');
  });
});
