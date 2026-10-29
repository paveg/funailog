import { loadDefaultJapaneseParser } from 'budoux';

let parser: ReturnType<typeof loadDefaultJapaneseParser> | undefined;

export function segmentJapanese(text: string): string[] {
  parser ??= loadDefaultJapaneseParser();
  return parser.parse(text);
}
