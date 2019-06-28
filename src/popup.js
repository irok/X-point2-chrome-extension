import Credential from './credential';
import login from './login';
import storage from './storage';

async function open_xpoint() {
  const crdt = await Credential.retrieve(storage);
  console.log(await login(crdt));
  window.open('https://xpt.gmo-media.jp/xpoint/login.jsp?login=site', '_blank');
}

document.getElementById('open').addEventListener('click', open_xpoint);
