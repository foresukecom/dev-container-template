// Background service worker
console.log('Background service worker loaded');

// インストール時の処理
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);

  // デフォルト設定の保存
  chrome.storage.sync.set({
    setting: 'default_value'
  });
});

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  if (request.action === 'performAction') {
    // アクションを実行
    performAction()
      .then((result) => {
        sendResponse({ success: true, message: result });
      })
      .catch((error) => {
        sendResponse({ success: false, message: error.message });
      });

    // 非同期レスポンスのためtrueを返す
    return true;
  }
});

// アクションの実装例
async function performAction(): Promise<string> {
  // ここに実際の処理を実装
  return '処理が完了しました';
}

// タブの更新を監視
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});

// コンテキストメニューの追加例（オプション）
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'myExtensionAction',
    title: 'My Extension Action',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myExtensionAction' && tab?.id) {
    console.log('Selected text:', info.selectionText);
    // 選択されたテキストに対する処理
  }
});
