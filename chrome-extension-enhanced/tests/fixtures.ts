import { createServer, type Server } from 'node:http';
import { AddressInfo } from 'node:net';
import path from 'node:path';
import { test as base, chromium, type BrowserContext, type Worker } from '@playwright/test';

const pathToExtension = path.join(__dirname, '..', 'dist');

type ExtensionFixtures = {
  context: BrowserContext;
  /** chrome-extension://<id> の <id> 部分。毎回変わるのでテスト内で組み立てる */
  extensionId: string;
  /** background service worker。拡張機能側のAPIを直接叩くのに使う */
  serviceWorker: Worker;
  /** content script を検証するためのローカルページのURL */
  fixturePageUrl: string;
};

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    // 拡張機能は永続コンテキストでしか読み込めない。
    // channel: 'chromium' の新ヘッドレスは拡張機能に対応している。
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);
    await context.close();
  },

  serviceWorker: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await use(worker);
  },

  extensionId: async ({ serviceWorker }, use) => {
    await use(new URL(serviceWorker.url()).host);
  },

  fixturePageUrl: async ({}, use) => {
    // content script の検証用。data: URL には content script が注入されないため
    // 実際にHTTPで配信する。
    const server: Server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>Fixture</title></head>' +
          '<body><p id="target">Playwright からハイライトされるテキスト</p></body></html>'
      );
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;

    await use(`http://127.0.0.1:${port}/`);

    // ブラウザのkeep-alive接続が残るとcloseが完了しないため、先に切断する
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  },
});

export const expect = test.expect;
