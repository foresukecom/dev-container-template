// Background service worker
console.log('Background service worker loaded');

// インストール時の処理（リスナーは1つにまとめる）
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);

  // デフォルト設定の保存
  chrome.storage.sync.set({ setting: 'default_value' });

  // コンテキストメニューの追加（manifest.json の "contextMenus" 権限が必要）
  chrome.contextMenus.create({
    id: 'myExtensionAction',
    title: 'My Extension Action',
    contexts: ['selection'],
  });
});

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Message received:', request);

  if (request.action === 'performAction') {
    performAction()
      .then((result) => sendResponse({ success: true, message: result }))
      .catch((error: Error) => sendResponse({ success: false, message: error.message }));

    // 非同期でsendResponseを呼ぶためtrueを返す
    return true;
  }

  return false;
});

// アクションの実装例
async function performAction(): Promise<string> {
  // ここに実際の処理を実装
  return '処理が完了しました';
}

// 選択テキストに対するコンテキストメニューの処理例
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myExtensionAction' && tab?.id) {
    console.log('Selected text:', info.selectionText);
  }
});

// タブの更新を監視する例
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});
