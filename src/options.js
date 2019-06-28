function save_options() {
  const status = document.getElementById('status');
  const domCd = document.getElementById('domCd').value;
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  chrome.runtime.getBackgroundPage(async ({Credential, storage, login}) => {
    const crdt = (new Credential(storage)).assign({domCd, user, pass});

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
  chrome.runtime.getBackgroundPage(async ({Credential, storage}) => {
    const crdt = await Credential.retrieve(storage);

    document.getElementById('domCd').value = crdt.domCd;
    document.getElementById('user').value = crdt.user;
    document.getElementById('pass').value = crdt.pass;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
