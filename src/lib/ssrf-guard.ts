import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/**
 * SSRF guard for build-time URL fetches (LinkCard / OG image pipeline).
 *
 * Rejects:
 *   - non-http(s) protocols (file:, data:, ftp:, javascript:, ...)
 *   - loopback / RFC1918 / CGNAT / link-local / ULA / TEST-NET / multicast /
 *     benchmark ranges for both IPv4 and IPv6 (incl. IPv4-mapped IPv6)
 *   - hostnames whose DNS lookup returns any of the above
 *
 * Known limitation — DNS rebinding (TOCTOU):
 *   After this guard runs, `fetch-site-metadata` and `fetch()` each perform
 *   their own DNS lookup. An attacker-controlled authoritative server with
 *   TTL=0 could return a public address here and a private one to the
 *   downstream call. Fully closing this would require a custom `undici`
 *   dispatcher that resolves once and connects by IP literal with a
 *   Host header — deemed not worth the complexity for a personal blog
 *   whose only attacker is a PR submitter (who also passes code review).
 *   Revisit if this repo starts accepting anonymous contributions.
 */

// ── IPv4 private/reserved ranges (src: IANA) ──────────────────────────
const isPrivateIPv4 = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b, c] = parts as [number, number, number, number];
  if (a === 0) return true; // 0.0.0.0/8 "this network"
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT (RFC 6598)
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local (incl. IMDS)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && c === 2) return true; // 192.0.2.0/24 TEST-NET-1
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmark (RFC 2544)
  if (a === 198 && b === 51 && c === 100) return true; // 198.51.100.0/24 TEST-NET-2
  if (a === 203 && b === 0 && c === 113) return true; // 203.0.113.0/24 TEST-NET-3
  if (a >= 224) return true; // 224.0.0.0/4 multicast + 240.0.0.0/4 reserved
  return false;
};

// ── IPv6 private/reserved ranges ──────────────────────────────────────
const isPrivateIPv6 = (ip: string): boolean => {
  const lower = ip.toLowerCase();

  // ::1 loopback (also "0:0:0:0:0:0:0:1")
  if (lower === '::1' || /^0{0,4}(:0{0,4}){6}:0{0,3}1$/.test(lower)) {
    return true;
  }

  // Unspecified ::
  if (lower === '::') return true;

  // IPv4-mapped IPv6 "::ffff:a.b.c.d" — extract and recurse
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped?.[1]) return isPrivateIPv4(mapped[1]);

  // Also "::ffff:0:a.b.c.d" (IPv4-translated) and hex form "::ffff:xxxx:xxxx"
  const hexMapped = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMapped?.[1] && hexMapped[2]) {
    const hi = parseInt(hexMapped[1], 16);
    const lo = parseInt(hexMapped[2], 16);
    const ipv4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
    return isPrivateIPv4(ipv4);
  }

  // fc00::/7 unique local (fc.. / fd..)
  if (/^f[cd][0-9a-f]{0,2}:/.test(lower)) return true;

  // fe80::/10 link-local
  if (/^fe[89ab][0-9a-f]?:/.test(lower)) return true;

  // ff00::/8 multicast
  if (/^ff[0-9a-f]{0,2}:/.test(lower)) return true;

  return false;
};

const isPrivateAddress = (ip: string): boolean => {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return false;
};

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export const assertPublicUrl = async (raw: string): Promise<void> => {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`invalid URL: ${raw}`);
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(
      `blocked protocol: ${parsed.protocol} (only http/https allowed)`,
    );
  }

  // Strip brackets from IPv6 literals: "[::1]" -> "::1"
  const host = parsed.hostname.replace(/^\[|\]$/g, '');

  if (!host) {
    throw new Error(`invalid URL: empty host`);
  }

  // Direct IP literal: check immediately
  if (isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new Error(
        `blocked private/loopback/link-local/reserved address: ${host}`,
      );
    }
    return;
  }

  // Hostname: DNS resolve and check all returned addresses
  let addresses: { address: string; family: number }[];
  try {
    addresses = await lookup(host, { all: true, verbatim: true });
  } catch (e) {
    throw new Error(
      `DNS lookup failed for ${host}: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  if (addresses.length === 0) {
    throw new Error(`DNS lookup returned no addresses for ${host}`);
  }

  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new Error(
        `blocked private/loopback/link-local/reserved address for ${host}: ${address}`,
      );
    }
  }
};
