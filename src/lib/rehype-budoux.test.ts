import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { describe, it, expect } from 'vitest';

import rehypeBudoux from './rehype-budoux';

async function process(
  html: string,
  options: NonNullable<Parameters<typeof rehypeBudoux>[0]> = {},
): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeBudoux, options)
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

  it('with includeTagNames, segments only matching elements (headings), not paragraphs', async () => {
    const output = await process(
      '<h2>今日はいい天気ですね。</h2><p>今日はいい天気ですね。</p>',
      { includeTagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    );
    const h2 = output.match(/<h2[\s\S]*?<\/h2>/)![0];
    expect(h2).toContain('<wbr>');
    expect(h2).toContain('data-budoux');
    const p = output.match(/<p[\s\S]*?<\/p>/)![0];
    expect(p).not.toContain('<wbr>');
    expect(p).not.toContain('data-budoux');
  });

  it('with includeTagNames, segments heading text even when an anchor is present', async () => {
    const output = await process(
      '<h2><a href="#x"><span>#</span></a>今日はいい天気ですね。</h2>',
      { includeTagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    );
    const h2 = output.match(/<h2[\s\S]*?<\/h2>/)![0];
    expect(h2).toContain('<wbr>');
    // the anchor content stays atomic
    const anchorInner = h2.match(/<a[^>]*>([\s\S]*?)<\/a>/)![1];
    expect(anchorInner).not.toContain('<wbr>');
  });

  it('does not insert <wbr> inside <a> with nested inline elements', async () => {
    const output = await process(
      '<p>まずは<a href="https://example.com"><strong>公式ドキュメントを読みます</strong></a>の続き。</p>',
    );
    // Everything between <a ...> and </a> must be <wbr>-free
    const anchorMatch = output.match(/<a[^>]*>([\s\S]*?)<\/a>/);
    expect(anchorMatch).not.toBeNull();
    const anchorInner = anchorMatch![1];
    expect(anchorInner).not.toContain('<wbr>');
  });
});
