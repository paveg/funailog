import { afterEach, describe, expect, it, vi } from 'vitest';

// Hoisted mock: returned payload simulates an attacker-controlled public
// domain whose HTML declared <meta property="og:image" content="http://127.0.0.1/..."> —
// the classic second-stage SSRF via og:image. The first-stage guard would
// accept example.com, so the second-stage guard in fetchWithTimeout must
// catch the private image URL.
vi.mock('fetch-site-metadata', () => ({
  default: vi.fn(async (url: string) => {
    if (url === 'https://malicious-og.example.com/') {
      return {
        title: 'legit-looking title',
        description: 'legit-looking description',
        image: { src: 'http://127.0.0.1:8080/internal-admin' },
      };
    }
    return {
      title: 'Not found',
      description: 'page not found',
      image: { src: undefined },
    };
  }),
}));

// Stub DNS for the malicious test host so the first-stage guard sees a
// public address and lets the request proceed to the second stage where
// the og:image private URL must be blocked.
vi.mock('node:dns/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:dns/promises')>();
  return {
    ...actual,
    lookup: vi.fn(async (hostname: string) => {
      if (hostname === 'malicious-og.example.com') {
        return [{ address: '93.184.216.34', family: 4 }];
      }
      // Any other host in tests should use the public-IP fast path
      // (via an IP literal in the test URL) — we never fall back to the
      // real resolver so tests stay offline-deterministic.
      throw new Error(`unexpected dns.lookup call for ${hostname}`);
    }),
  };
});

import { fetchLinkCard } from './api';

describe('fetchLinkCard SSRF guard integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('blocks loopback URLs before any network call and returns fallback', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchLinkCard('http://127.0.0.1/admin');

    expect(result.title).toBe('Not found');
    expect(result.description).toBe('page not found');
    expect(result.image.src).toBeUndefined();

    // The guard must log its specific message — distinguishes guard-block
    // from a generic network failure inside fetch-site-metadata.
    const guardBlocked = warn.mock.calls.some((call) =>
      String(call[0]).includes('blocked non-public URL'),
    );
    expect(guardBlocked).toBe(true);
  });

  it('blocks AWS IMDS address', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchLinkCard(
      'http://169.254.169.254/latest/meta-data/',
    );

    expect(result.title).toBe('Not found');
    expect(
      warn.mock.calls.some((call) =>
        String(call[0]).includes('blocked non-public URL'),
      ),
    ).toBe(true);
  });

  it('blocks non-http protocols', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchLinkCard('file:///etc/passwd');

    expect(result.title).toBe('Not found');
    expect(
      warn.mock.calls.some((call) =>
        String(call[0]).includes('blocked non-public URL'),
      ),
    ).toBe(true);
  });

  // ── Second-stage SSRF via og:image ──────────────────────────────────
  // This is the vector that motivated the guard: an attacker-controlled
  // public site returns an og:image pointing to a private address.
  it('blocks second-stage private og:image URL', async () => {
    // Prevent real network: if the guard fails, the real fetch() would fire
    // and this spy catches it so the test fails deterministically instead
    // of hanging on network.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('network should not be called'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchLinkCard('https://malicious-og.example.com/');

    // Metadata first stage: accepted the public URL, so title comes through.
    expect(result.title).toBe('legit-looking title');
    // But the og:image fetch must have been blocked — result.image.src undefined.
    expect(result.image.src).toBeUndefined();

    // The specific image-path warning proves fetchWithTimeout's guard fired.
    expect(
      warn.mock.calls.some((call) =>
        String(call[0]).includes('blocked non-public image URL'),
      ),
    ).toBe(true);

    // And no real fetch happened.
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
