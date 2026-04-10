import { describe, it, expect } from 'vitest';

import { assertPublicUrl } from './ssrf-guard';

describe('assertPublicUrl', () => {
  // ── Allowed ─────────────────────────────────────────────────────────
  describe('allows public URLs', () => {
    it('accepts https://example.com', async () => {
      await expect(assertPublicUrl('https://example.com/')).resolves.toBe(
        undefined,
      );
    });

    it('accepts http://example.com', async () => {
      await expect(assertPublicUrl('http://example.com/')).resolves.toBe(
        undefined,
      );
    });

    it('accepts public IP literals (e.g. 8.8.8.8)', async () => {
      await expect(assertPublicUrl('http://8.8.8.8/')).resolves.toBe(undefined);
    });
  });

  // ── Blocked protocols ───────────────────────────────────────────────
  describe('blocks non-http(s) protocols', () => {
    it.each([
      'file:///etc/passwd',
      'ftp://example.com/',
      'gopher://example.com/',
      'data:text/plain,hi',
      'javascript:alert(1)',
    ])('blocks %s', async (url) => {
      await expect(assertPublicUrl(url)).rejects.toThrow(/protocol/);
    });
  });

  // ── Blocked IP literals ─────────────────────────────────────────────
  describe('blocks private/loopback/link-local IP literals', () => {
    it.each([
      'http://127.0.0.1/',
      'http://127.1.2.3/',
      'http://10.0.0.1/',
      'http://10.255.255.255/',
      'http://172.16.0.1/',
      'http://172.31.255.255/',
      'http://192.168.1.1/',
      'http://169.254.169.254/latest/meta-data/', // AWS IMDS
      'http://100.64.0.1/', // CGNAT (shared address space, RFC 6598)
      'http://100.127.255.255/', // CGNAT upper bound
      'http://198.18.0.1/', // benchmark (RFC 2544)
      'http://198.19.255.255/',
      'http://192.0.2.1/', // TEST-NET-1 (docs)
      'http://198.51.100.1/', // TEST-NET-2
      'http://203.0.113.1/', // TEST-NET-3
      'http://[::1]/',
      'http://[::ffff:127.0.0.1]/', // IPv4-mapped IPv6 loopback
      'http://[fc00::1]/', // IPv6 ULA
      'http://[fd12:3456::1]/', // IPv6 ULA
      'http://[fe80::1]/', // IPv6 link-local
    ])('blocks %s', async (url) => {
      await expect(assertPublicUrl(url)).rejects.toThrow(
        /private|loopback|link-local|reserved/i,
      );
    });
  });

  // ── Blocked hostnames that resolve to private IPs ───────────────────
  describe('blocks hostnames that resolve to private IPs', () => {
    it('blocks localhost', async () => {
      await expect(assertPublicUrl('http://localhost/')).rejects.toThrow();
    });
  });

  // ── SSRF bypass obfuscation (decimal/hex/octal IPv4) ────────────────
  describe('blocks obfuscated IP notations that resolve to private addresses', () => {
    it.each([
      'http://2130706433/', // decimal 127.0.0.1
      'http://0x7f000001/', // hex 127.0.0.1
      'http://017700000001/', // octal 127.0.0.1
      'http://127.1/', // shorthand 127.0.0.1
    ])('blocks %s', async (url) => {
      await expect(assertPublicUrl(url)).rejects.toThrow();
    });
  });

  // ── Malformed input ─────────────────────────────────────────────────
  describe('rejects malformed input', () => {
    it('rejects non-URL strings', async () => {
      await expect(assertPublicUrl('not a url')).rejects.toThrow();
    });

    it('rejects empty string', async () => {
      await expect(assertPublicUrl('')).rejects.toThrow();
    });
  });
});
