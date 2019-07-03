function save_options() {
  const status = document.getElementById('status');
  const domCd = document.getElementById('domCd').value;
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  chrome.runtime.getBackgroundPage(async ({credential, login}) => {
    const crdt = credential.create({domCd, user, pass});

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

    document.getElementById('domCd').value = crdt.domCd;
    document.getElementById('user').value = crdt.user;
    document.getElementById('pass').value = crdt.pass;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
