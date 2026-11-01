export type DisclosureLabel =
  | '本名'
  | 'MAC アドレス'
  | 'IPv6 のグローバルアドレス'
  | 'メールアドレス';

export type DisclosureFinding = {
  label: DisclosureLabel;
  line: number;
  match: string;
};

const PUBLIC_IPV6_PREFIXES = [
  '2001:db8:', // RFC 3849 の文書用
  '2001:4860:', // Google Public DNS
  '2404:6800:', // Google
  '2606:4700:', // Cloudflare
];

const DISCLOSURE_RULES: {
  label: DisclosureLabel;
  pattern: RegExp;
  isAllowed?: (match: string) => boolean;
}[] = [
  { label: '本名', pattern: /池澤|イケザワ|ikezawa/gi },
  { label: 'MAC アドレス', pattern: /\b[0-9a-f]{2}(?::[0-9a-f]{2}){5}\b/gi },
  {
    label: 'IPv6 のグローバルアドレス',
    pattern: /\b[23][0-9a-f]{3}:[0-9a-f]{1,4}:[0-9a-f:]+/gi,
    isAllowed: (match) =>
      PUBLIC_IPV6_PREFIXES.some((prefix) =>
        match.toLowerCase().startsWith(prefix),
      ),
  },
  {
    label: 'メールアドレス',
    pattern: /[a-z0-9._+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}\b/gi,
    isAllowed: (match) => /@example\.(?:com|org|net)$/i.test(match),
  },
];

export function findDisclosures(text: string): DisclosureFinding[] {
  const findings: DisclosureFinding[] = [];
  text.split('\n').forEach((lineText, index) => {
    for (const { label, pattern, isAllowed } of DISCLOSURE_RULES) {
      for (const [match] of lineText.matchAll(pattern)) {
        if (!isAllowed?.(match)) {
          findings.push({ label, line: index + 1, match });
        }
      }
    }
  });
  return findings;
}

export type InternalLinkContext = {
  publishedPosts: ReadonlySet<string>;
  draftPosts: ReadonlySet<string>;
  isSourcePublished: boolean;
  isKnownRoute: (path: string) => boolean;
};

const EXTERNAL_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const POST_PATH = /^\/blog\/(\d{4}\/[^/]+)$/;

export function checkInternalLink(
  url: string,
  context: InternalLinkContext,
): string | null {
  if (url.startsWith('#') || EXTERNAL_URL.test(url)) {
    return null;
  }
  if (!url.startsWith('/')) {
    return `相対パスのリンクです。/blog/{year}/{slug} の形で書いてください: ${url}`;
  }

  const path = url.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
  const postId = path.match(POST_PATH)?.[1];

  if (!postId) {
    return context.isKnownRoute(path)
      ? null
      : `リンク先のページがありません: ${url}`;
  }
  if (context.publishedPosts.has(postId)) {
    return null;
  }
  if (context.draftPosts.has(postId)) {
    return context.isSourcePublished
      ? `公開記事から下書きの記事へリンクしています: ${url}`
      : null;
  }
  return `リンク先の記事がありません: ${url}`;
}
