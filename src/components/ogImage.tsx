import { readFileSync } from 'fs';

import satori from 'satori';
import sharp from 'sharp';

const fontData = readFileSync('./src/assets/LineSeedJP-Bold.ttf');
const logoBuffer = readFileSync('./src/assets/logo_512.png');
const logoBase64 = btoa(
  new Uint8Array(logoBuffer).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    '',
  ),
);

const ACCENT = 'hsl(225, 30%, 42%)';
const MUTED = 'hsl(0, 0%, 42%)';
const BG = 'hsl(220, 20%, 97%)';
const FG = 'hsl(0, 0%, 8%)';

function getTitleFontSize(text: string): string {
  const length = text.length;
  if (length <= 20) return '3.5rem';
  if (length <= 35) return '3rem';
  if (length <= 50) return '2.5rem';
  if (length <= 70) return '2.25rem';
  return '2rem';
}

const ogImage = async (
  text: string,
  date?: Date,
  emoji?: string,
  category?: string,
) => {
  const titleFontSize = getTitleFontSize(text);

  const svg = await satori(
    <div
      style={{
        fontFamily: 'LINE Seed JP, sans-serif',
        background: BG,
        color: FG,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: ACCENT,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          padding: '3rem 3.5rem 0',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '120px',
            height: '120px',
          }}
        >
          {emoji ?? '📝'}
        </div>

        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.35,
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            margin: 0,
            flexGrow: 1,
          }}
        >
          {text}
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 3.5rem 2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {category && (
            <span
              style={{
                background: ACCENT,
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {category}
            </span>
          )}
          {date && (
            <span style={{ fontSize: '1.125rem', color: MUTED }}>
              {date.toISOString().split('T')[0]}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={`data:image/png;base64,${logoBase64}`}
            alt=""
            width={36}
            height={36}
            style={{ borderRadius: '9999px' }}
          />
          <span style={{ fontSize: '1.25rem', color: MUTED, fontWeight: 700 }}>
            funailog.com
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'LINE Seed JP',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
      loadAdditionalAsset: async (languageCode, segment) => {
        if (languageCode === 'emoji') {
          const emojiSvg = await fetch(
            'https://rawcdn.githack.com/googlefonts/noto-emoji/main/svg/emoji_u' +
              segment.codePointAt(0)?.toString(16) +
              '.svg',
            { cache: 'force-cache' },
          ).then((res) => res.text());
          return `data:image/png;base64,${await sharp(Buffer.from(emojiSvg), {
            density: 300,
          })
            .toFormat('png')
            .toBuffer()
            .then((buf) => buf.toString('base64'))}`;
        }
        return '';
      },
    },
  );

  return await sharp(Buffer.from(svg))
    .toFormat('png', { quality: 80 })
    .toBuffer();
};

export default ogImage;
