function openSite() {
  chrome.runtime.getBackgroundPage(async ({credential, service}) => {
    try {
      const crdt = await credential.load();
      await service.login(crdt);
    } catch(e) {}

    service.openSite();
  });
}

document.getElementById('open').addEventListener('click', openSite);
