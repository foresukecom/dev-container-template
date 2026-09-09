// Content script: Webページに注入され、ページのDOMを操作する。
console.log('Content script loaded');

const pageInfo = {
  url: window.location.href,
  title: document.title,
  timestamp: new Date().toISOString(),
};

/** 正規表現に渡す文字列をエスケープする */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * ページ内の該当テキストを <mark> で囲む。
 * innerHTML を組み立て直すとページ側のイベントリスナーが失われるため、
 * テキストノードだけを辿って置き換える。
 */
function highlightText(text: string): number {
  if (!text) return 0;

  const pattern = new RegExp(escapeRegExp(text), 'gi');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // スクリプトや既にハイライト済みの箇所は対象外
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, mark.my-extension-highlight')) {
        return NodeFilter.FILTER_REJECT;
      }
      return pattern.test(node.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  const targets: Text[] = [];
  while (walker.nextNode()) {
    targets.push(walker.currentNode as Text);
  }

  let count = 0;
  for (const node of targets) {
    const fragment = document.createDocumentFragment();
    const value = node.nodeValue ?? '';
    let lastIndex = 0;

    pattern.lastIndex = 0;
    for (let match = pattern.exec(value); match !== null; match = pattern.exec(value)) {
      fragment.append(value.slice(lastIndex, match.index));

      const mark = document.createElement('mark');
      mark.className = 'my-extension-highlight';
      mark.textContent = match[0];
      fragment.append(mark);

      lastIndex = match.index + match[0].length;
      count += 1;
    }

    fragment.append(value.slice(lastIndex));
    node.replaceWith(fragment);
  }

  return count;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.action === 'getPageInfo') {
    sendResponse(pageInfo);
    return false;
  }

  if (request.action === 'highlight') {
    sendResponse({ count: highlightText(request.text) });
    return false;
  }

  return false;
});

// ストレージから設定を読み込んで適用する例
chrome.storage.sync.get(['setting'], (result) => {
  console.log('Content script setting:', result.setting);
});
