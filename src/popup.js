import React from 'react';
import ReactDOM from 'react-dom';
import PopupApp from './components/PopupApp.jsx';
import './popup.scss';

chrome.runtime.getBackgroundPage(async ({cache, credential, login, service}) => {
  const props = {
    openSite() {
      service.openSite();
    },
    openForm(event, form) {
      event.preventDefault();
      service.openForm(form);
    }
  };

  if ((await credential.load()).user === '') {
    props.error = 'アイコンを右クリックし、オプションからログイン情報を設定してください。';
  } else {
    try {
      if (await login()) {
        const [bookmarks, wkfllist] = await Promise.all([
          cache.bookmarks(),
          cache.wkfllist()
        ]);
        Object.assign(props, {bookmarks, wkfllist});
      } else {
        props.error = 'ログインできませんでした。';
      }
    } catch (e) {
      props.error = 'ネットワークエラーが発生しました。社外の場合はVPNを確認してください。';
    }
  }

  ReactDOM.render(<PopupApp {...props}/>, document.getElementById('popup-app'));
});
