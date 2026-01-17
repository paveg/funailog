import fs from 'fs';
import path from 'path';

const publicCacheDir = path.join(process.cwd(), './public/.cache');
const destCacheDir = path.join(process.cwd(), './dist/.cache');

// キャッシュディレクトリを削除せず、存在を確認するのみ
// これによりLinkCard画像キャッシュがビルド間で保持される
await Promise.all([
  fs.promises.mkdir(`${publicCacheDir}/embed`, { recursive: true }),
  fs.promises.mkdir(`${destCacheDir}/embed`, { recursive: true }),
]);

console.log('✓ Cache directories ensured (preserved existing cache)');
