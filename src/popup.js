function open_xpoint() {
  chrome.runtime.getBackgroundPage(async ({credential, login}) => {
    try {
      const crdt = await credential.load();
      await login(crdt);
    } catch(e) {}

    window.open('https://xpt.gmo-media.jp/xpoint/login.jsp?login=site', '_blank');
  });
}

document.getElementById('open').addEventListener('click', open_xpoint);
