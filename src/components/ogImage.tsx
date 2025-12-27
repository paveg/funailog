import { readFileSync } from 'fs';

import satori from 'satori';
import sharp from 'sharp';

const ogImage = async (text: string, date?: Date, emoji?: string) => {
  const notoFontData = readFileSync('./src/assets/NotoSansCJKjp-Bold.woff');

  const logoBuffer = readFileSync('./src/assets/logo_512.png');
  const logo = btoa(
    new Uint8Array(logoBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  );
  const svg = await satori(
    <div
      style={{
        fontFamily: 'Noto Sans CJK JP, Noto Color Emoji, sans-serif',
        background: '#fff',
        color: '#636363',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '30%',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2
            style={{
              fontSize: '16rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {emoji ?? '📝'}
          </h2>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '70%',
          maxHeight: '100%',
          padding: '3rem',
        }}
      >
        <h1
          style={{
            marginTop: 0,
            fontSize: '4rem',
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.4',
          }}
        >
          {text}
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex' }}>
            <h2
              style={{
                fontSize: '2.25rem',
              }}
            >
              <p>{date && `${date.toISOString().split('T')[0]}`}</p>
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={`data:image/png;base64,${logo}`}
              alt="www.funailog.com"
              width={50}
              height={50}
              style={{
                borderRadius: '9999px',
                marginRight: '1.25rem',
              }}
            />
            <h2
              style={{
                marginRight: '1.25rem',
                fontSize: '2.25rem',
              }}
            >
              {'www.funailog.com'}
            </h2>
          </div>
        </div>
      </div>
    </div>,
    {
      // debug: true,
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans CJK JP',
          data: notoFontData,
          weight: 700,
          style: 'normal',
        },
      ],
      loadAdditionalAsset: async (languageCode, segment) => {
        if (languageCode === 'emoji') {
          const emojiSvg = await fetch(
            // https://fonts.google.com/noto/specimen/Noto+Color+Emoji?query=emoji
            'https://rawcdn.githack.com/googlefonts/noto-emoji/main/svg/emoji_u' +
              segment.codePointAt(0)?.toString(16) +
              '.svg',
            {
              cache: 'force-cache',
            },
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
  const imgBuffer = await sharp(Buffer.from(svg))
    .toFormat('png', {
      quality: 75,
    })
    .toBuffer();
  return imgBuffer;
};

export default ogImage;
