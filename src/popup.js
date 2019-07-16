(function() {
  chrome.runtime.getBackgroundPage(async ({credential, service}) => {
    try {
      const crdt = await credential.load();
      await service.login(crdt);

      const bookmarks = await service.getBookmarkList();
      for (let bkm of bookmarks) {
        const a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.addEventListener('click', () => service.openForm(bkm));
        a.textContent = bkm.title;
        const div = document.createElement('div');
        div.appendChild(a);
        document.getElementById('forms').appendChild(div);
      }
    } catch(e) {}
  });
})();

function openSite() {
  chrome.runtime.getBackgroundPage(({service}) => {
    service.openSite();
  });
}

document.getElementById('open').addEventListener('click', openSite);
