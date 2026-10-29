import { describe, it, expect } from 'vitest';

import { segmentJapanese } from './budoux-segments';

describe('segmentJapanese', () => {
  it('splits Japanese text into phrases that join back to the input', () => {
    const text = '今日はいい天気ですね。';
    const segments = segmentJapanese(text);
    expect(segments.length).toBeGreaterThan(1);
    expect(segments.join('')).toBe(text);
  });

  it('returns an empty array for an empty string', () => {
    expect(segmentJapanese('')).toEqual([]);
  });
});
