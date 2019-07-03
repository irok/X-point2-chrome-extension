function save_options() {
  chrome.runtime.getBackgroundPage(async ({credential, login}) => {
    const data = Object.fromEntries(
      credential.keys.map(key => [key, document.getElementById(key).value])
    );
    const crdt = credential.create(data);
    const status = document.getElementById('status');

    try {
      if (await login(crdt, {test: true})) {
        await crdt.save();
        status.textContent = '保存しました';
      } else {
        status.textContent = 'ログイン情報が正しくありません';
      }
    } catch (err) {
      status.textContent = err.message;
    }
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
}

function restore_options() {
  chrome.runtime.getBackgroundPage(async ({credential}) => {
    const crdt = await credential.load();

    for (let key of credential.keys) {
      document.getElementById(key).value = crdt[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
