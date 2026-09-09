// Chrome ウェブストア提出用のスクリーンショットを生成する。
// ストアが受け付けるのは 1280x800 または 640x400 の PNG / JPEG。
import { createServer } from 'node:http';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const extensionPath = resolve(root, 'dist');
const outDir = resolve(root, 'screenshots');

const WIDTH = 1280;
const HEIGHT = 800;
// popup を単体で撮ると余白だらけになるため、この色の背景に載せて中央に置く
const BACKDROP = { r: 232, g: 238, b: 248 };

/** content script を確認するためのサンプルページ */
const SAMPLE_PAGE = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>サンプル記事</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 48px 64px; color: #202124; line-height: 1.9; }
      h1 { font-size: 28px; margin: 0 0 8px; }
      .meta { color: #5f6368; font-size: 13px; margin-bottom: 32px; }
      p { max-width: 720px; margin: 0 0 20px; }
    </style>
  </head>
  <body>
    <h1>拡張機能のサンプルページ</h1>
    <p class="meta">2026年9月9日</p>
    <p>このページは content script の動作を確認するためのサンプルです。拡張機能はページ内のテキストを走査して、指定した語句をハイライトします。</p>
    <p>ハイライトはテキストノードだけを対象にしているため、ページ側のイベントリスナーは壊れません。</p>
    <p>設定はオプションページから変更でき、chrome.storage に保存されます。</p>
  </body>
</html>`;

async function startSampleServer() {
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(SAMPLE_PAGE);
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    async close() {
      server.closeAllConnections();
      await new Promise((done) => server.close(done));
    },
  };
}

/** popup のような小さい画面を 1280x800 の中央に配置する */
async function composeOnBackdrop(buffer, outPath) {
  const backdrop = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { ...BACKDROP, alpha: 1 },
    },
  });

  await backdrop
    .composite([{ input: buffer, gravity: 'centre' }])
    .png()
    .toFile(outPath);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const sample = await startSampleServer();
const context = await chromium.launchPersistentContext('', {
  channel: 'chromium',
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

try {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  const extensionId = new URL(worker.url()).host;

  const page = await context.newPage();

  // 1. オプションページ（画面全体を使うのでそのまま1280x800で撮る）
  await page.goto(`chrome-extension://${extensionId}/options/options.html`);
  await page.screenshot({ path: resolve(outDir, '01-options.png') });
  console.log('generated screenshots/01-options.png');

  // 2. ポップアップ（実寸で撮ってから背景に合成する）
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);
  const size = await page.evaluate(() => ({
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  }));
  const popup = await page.screenshot({
    clip: { x: 0, y: 0, width: size.width, height: size.height },
  });
  await composeOnBackdrop(popup, resolve(outDir, '02-popup.png'));
  console.log('generated screenshots/02-popup.png');

  // 3. content script がページ上で動いている様子
  await page.goto(sample.url);
  await page.bringToFront();
  await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('対象タブが見つかりません');
    return chrome.tabs.sendMessage(tab.id, { action: 'highlight', text: 'ハイライト' });
  });
  await page.screenshot({ path: resolve(outDir, '03-content-script.png') });
  console.log('generated screenshots/03-content-script.png');
} finally {
  await context.close();
  await sample.close();
}
