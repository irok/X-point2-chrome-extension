function saveOptions() {
  chrome.runtime.getBackgroundPage(async ({credential, prefers, service, update}) => {
    // 認証情報
    const crdt = credential.create(Object.fromEntries(
      credential.keys.map(key => [key, document.getElementById(key).value])
    ));

    // その他の設定
    const prfs = prefers.create({
      showPendingApprovals: document.getElementById('showPendingApprovals').checked
    });

    const status = document.getElementById('status');

    try {
      if (crdt.empty() || await service.authenticate(crdt)) {
        await Promise.all([
          crdt.save(),
          prfs.save()
        ]);
        status.textContent = '保存しました';

        // 認証情報が空ならキャッシュをクリアする
        await update({reset: crdt.empty()});
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
  chrome.runtime.getBackgroundPage(async ({credential, prefers}) => {
    // 認証情報
    const crdt = await credential.load();
    for (let key of credential.keys) {
      document.getElementById(key).value = crdt[key];
    }

    // その他の設定
    const prfs = await prefers.load();
    document.getElementById('showPendingApprovals').checked = prfs.showPendingApprovals;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
