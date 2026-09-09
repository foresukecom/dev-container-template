import { expect, test } from './fixtures';

test('service worker が起動し、拡張機能IDを取得できる', async ({ extensionId, serviceWorker }) => {
  expect(extensionId).toMatch(/^[a-p]{32}$/);
  expect(serviceWorker.url()).toContain('background.js');
});

test('インストール時にデフォルト設定とコンテキストメニューが作られる', async ({
  serviceWorker,
}) => {
  // manifest に "contextMenus" 権限が無いと chrome.contextMenus が undefined になる
  const hasContextMenus = await serviceWorker.evaluate(
    () => typeof chrome.contextMenus === 'object'
  );
  expect(hasContextMenus).toBe(true);

  const setting = await serviceWorker.evaluate(async () => {
    const stored = await chrome.storage.sync.get(['setting']);
    return stored.setting;
  });
  expect(setting).toBe('default_value');
});

test('popup のボタンが service worker と通信して結果を表示する', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await expect(page.locator('h1')).toHaveText('Chrome Extension');

  await page.click('#action-btn');
  await expect(page.locator('#status')).toHaveText('処理が完了しました');
  await expect(page.locator('#status')).toHaveClass('success');
});

test('options ページで保存した設定が chrome.storage に永続化される', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options/options.html`);

  await page.fill('#setting', 'テスト値');
  await page.check('#enable-feature');
  await page.click('#save-btn');
  await expect(page.locator('#status')).toHaveText('設定を保存しました');

  // ページを開き直しても保存内容が復元される
  await page.reload();
  await expect(page.locator('#setting')).toHaveValue('テスト値');
  await expect(page.locator('#enable-feature')).toBeChecked();
});

test('options ページの「デフォルトに戻す」が設定を初期化する', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options/options.html`);

  await page.fill('#setting', '書き換えた値');
  await page.click('#save-btn');
  await expect(page.locator('#status')).toHaveText('設定を保存しました');

  await page.click('#reset-btn');
  await expect(page.locator('#status')).toHaveText('デフォルト設定に戻しました');
  await expect(page.locator('#setting')).toHaveValue('default_value');
});

test('content script がページに注入され、content.css が適用される', async ({
  context,
  serviceWorker,
  fixturePageUrl,
}) => {
  const page = await context.newPage();
  await page.goto(fixturePageUrl);
  await page.bringToFront();

  // service worker から content script にメッセージを送る。
  // url でのタブ検索には "tabs" 権限が必要になるため、アクティブタブを対象にする。
  const result = await serviceWorker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('対象タブが見つかりません');
    return chrome.tabs.sendMessage(tab.id, { action: 'highlight', text: 'ハイライト' });
  });

  expect(result).toEqual({ count: 1 });

  // DOMが書き換わり、content.css のスタイルが効いている
  const mark = page.locator('mark.my-extension-highlight');
  await expect(mark).toHaveText('ハイライト');
  await expect(mark).toHaveCSS('background-color', 'rgb(255, 255, 0)');
});

test('content script からページ情報を取得できる', async ({
  context,
  serviceWorker,
  fixturePageUrl,
}) => {
  const page = await context.newPage();
  await page.goto(fixturePageUrl);
  await page.bringToFront();

  const info = await serviceWorker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('対象タブが見つかりません');
    return chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' });
  });

  expect(info).toMatchObject({ title: 'Fixture' });
});
