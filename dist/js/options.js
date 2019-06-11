function save_options() {
  const domCd= document.getElementById('domCd').value;
  const user= document.getElementById('user').value;
  const pass= document.getElementById('pass').value;

  chrome.storage.sync.set({domCd, user, pass}, () => {
    // 保存完了するとここのコードが実行される
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    domCd: '001',
    user: '',
    pass: ''
  }, (items) => {
    document.getElementById('domCd').value = items.domCd;
    document.getElementById('user').value = items.user;
    document.getElementById('pass').value = items.pass;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
