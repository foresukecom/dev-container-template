// Popup script
document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('action-btn');
  const statusDiv = document.getElementById('status');

  if (actionBtn && statusDiv) {
    actionBtn.addEventListener('click', async () => {
      try {
        // バックグラウンドスクリプトにメッセージを送信
        const response = await chrome.runtime.sendMessage({ action: 'performAction' });

        statusDiv.textContent = response.message || 'アクションが実行されました';
        statusDiv.className = 'success';

        // 3秒後にステータスを非表示
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      } catch (error) {
        statusDiv.textContent = 'エラーが発生しました';
        statusDiv.className = 'error';
        console.error('Error:', error);
      }
    });
  }

  // ストレージから設定を読み込む例
  chrome.storage.sync.get(['setting'], (result) => {
    console.log('Current setting:', result.setting);
  });
});
