function open_xpoint() {
  chrome.runtime.getBackgroundPage(async ({Credential, storage, login}) => {
    const crdt = await Credential.retrieve(storage);
    console.log(await login(crdt));
    window.open('https://xpt.gmo-media.jp/xpoint/login.jsp?login=site', '_blank');
  });
}

document.getElementById('open').addEventListener('click', open_xpoint);
