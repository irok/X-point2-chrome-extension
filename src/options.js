import Credential from './credential';
import storage from './storage';

async function save_options() {
  const domCd = document.getElementById('domCd').value;
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  await (new Credential(storage)).assign({domCd, user, pass}).save();

  // 保存完了するとここのコードが実行される
  const status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

async function restore_options() {
  const crdnt = await Credential.retrieve(storage);

  document.getElementById('domCd').value = crdnt.domCd;
  document.getElementById('user').value = crdnt.user;
  document.getElementById('pass').value = crdnt.pass;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
