// Options page script
document.addEventListener('DOMContentLoaded', () => {
  const settingInput = document.getElementById('setting') as HTMLInputElement;
  const enableFeature = document.getElementById('enable-feature') as HTMLInputElement;
  const saveBtn = document.getElementById('save-btn');
  const resetBtn = document.getElementById('reset-btn');
  const statusDiv = document.getElementById('status');

  // 設定を読み込む
  function loadOptions(): void {
    chrome.storage.sync.get(['setting', 'enableFeature'], (result) => {
      if (settingInput) {
        settingInput.value = result.setting || 'default_value';
      }
      if (enableFeature) {
        enableFeature.checked = result.enableFeature || false;
      }
    });
  }

  // 設定を保存する
  function saveOptions(): void {
    const settings = {
      setting: settingInput?.value || 'default_value',
      enableFeature: enableFeature?.checked || false
    };

    chrome.storage.sync.set(settings, () => {
      if (statusDiv) {
        statusDiv.textContent = '設定を保存しました';
        statusDiv.className = 'success';

        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      }

      console.log('Settings saved:', settings);
    });
  }

  // デフォルトに戻す
  function resetOptions(): void {
    const defaultSettings = {
      setting: 'default_value',
      enableFeature: false
    };

    chrome.storage.sync.set(defaultSettings, () => {
      loadOptions();

      if (statusDiv) {
        statusDiv.textContent = 'デフォルト設定に戻しました';
        statusDiv.className = 'success';

        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      }
    });
  }

  // イベントリスナーを設定
  if (saveBtn) {
    saveBtn.addEventListener('click', saveOptions);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetOptions);
  }

  // ページ読み込み時に設定を読み込む
  loadOptions();
});
