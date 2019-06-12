import Credential from './credential';
import storage from './storage';

function save_options() {
  const domCd= document.getElementById('domCd').value;
  const user= document.getElementById('user').value;
  const pass= document.getElementById('pass').value;

  await (new Credential(storage)).assign({domCd, user, pass}).save();

  // 保存完了するとここのコードが実行される
  const status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

function restore_options() {
  const data = await Credential.retrieve(storage);

  document.getElementById('domCd').value = data.domCd;
  document.getElementById('user').value = data.user;
  document.getElementById('pass').value = data.pass;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
