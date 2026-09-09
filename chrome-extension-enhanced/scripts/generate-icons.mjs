// icons/icon.svg から manifest.json が要求する PNG を生成する。
// Chrome の拡張機能は SVG アイコンを読み込めないため、ビルド前に必ず実行する。
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'icons/icon.svg');
const outDir = resolve(root, 'public/icons');

// manifest.json の icons / action.default_icon と対応させること
const SIZES = [16, 48, 128];

await mkdir(outDir, { recursive: true });

for (const size of SIZES) {
  const out = resolve(outDir, `icon${size}.png`);
  await sharp(source, { density: 384 }).resize(size, size).png().toFile(out);
  console.log(`generated icons/icon${size}.png`);
}
