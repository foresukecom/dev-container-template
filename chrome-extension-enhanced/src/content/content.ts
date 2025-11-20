// Content script
console.log('Content script loaded');

// ページの情報を取得
const pageInfo = {
  url: window.location.href,
  title: document.title,
  timestamp: new Date().toISOString()
};

console.log('Page info:', pageInfo);

// バックグラウンドスクリプトからのメッセージを受信
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.action === 'getPageInfo') {
    sendResponse(pageInfo);
  }

  return true;
});

// DOM操作の例
function highlightText(text: string): void {
  const bodyText = document.body.innerHTML;
  const highlightedText = bodyText.replace(
    new RegExp(text, 'gi'),
    (match) => `<mark style="background-color: yellow;">${match}</mark>`
  );
  document.body.innerHTML = highlightedText;
}

// ストレージから設定を読み込んで適用
chrome.storage.sync.get(['setting'], (result) => {
  console.log('Content script setting:', result.setting);
  // 設定に基づいた処理
});

// DOMの変更を監視する例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('DOM changed');
      // DOM変更時の処理
    }
  });
});

// 監視を開始
observer.observe(document.body, {
  childList: true,
  subtree: true
});
