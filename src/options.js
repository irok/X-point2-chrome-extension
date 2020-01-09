function saveOptions() {
  chrome.runtime.getBackgroundPage(async ({cache, credential, service, update}) => {
    const data = Object.fromEntries(
      credential.keys.map(key => [key, document.getElementById(key).value])
    );
    const crdt = credential.create(data);
    const status = document.getElementById('status');

    try {
      if (crdt.empty() || await service.authenticate(crdt)) {
        await crdt.save();
        status.textContent = '保存しました';
        if (crdt.empty()) {
          // 認証情報が消されたらキャッシュを消す
          await Promise.all([
            cache.bookmarks(null),
            cache.wkfllist(null)
          ]);
        } else {
          // それ以外ならキャッシュを更新してバッジを表示
          await update();
        }
      } else {
        status.textContent = 'ログイン情報が正しくありません';
      }
    } catch (err) {
      status.textContent = err.message;
    }
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
}

function restoreOptions() {
  chrome.runtime.getBackgroundPage(async ({credential}) => {
    const crdt = await credential.load();
    for (let key of credential.keys) {
      document.getElementById(key).value = crdt[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
