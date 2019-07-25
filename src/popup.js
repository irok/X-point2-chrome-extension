import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class PopupApp extends Component {
  render() {
    return (
      <div>
        <button id="open">X-pointを開く</button>
        <div id="forms"></div>
      </div>
    );
  }
}

ReactDOM.render(<PopupApp />, document.getElementById('popup-app'));

/*
ここから先はいったんコメントアウト
(function() {
  chrome.runtime.getBackgroundPage(async ({credential, service}) => {
    try {
      const crdt = await credential.load();
      await service.login(crdt);

      const bookmarks = await service.getBookmarkList();
      for (let bkm of bookmarks) {
        const a = document.createElement('a');
        a.setAttribute('href', service.constructor.url(bkm.pathname));
        a.addEventListener('click', (event) => {
          event.preventDefault();
          service.openForm(bkm);
        });
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
*/
