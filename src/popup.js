function open_xpoint() {
  chrome.runtime.getBackgroundPage(async ({credential, login}) => {
    const crdt = await credential.load();
    console.log(await login(crdt));
    window.open('https://xpt.gmo-media.jp/xpoint/login.jsp?login=site', '_blank');
  });
}

document.getElementById('open').addEventListener('click', open_xpoint);
