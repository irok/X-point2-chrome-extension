import React, {Suspense, useState} from 'react';
import ReactDOM from 'react-dom';
import Info from './components/Info.jsx';
import PopupBody from './components/PopupBody.jsx';
import Spinner from './components/Spinner.jsx';
import './popup.scss';

// メインコンポーネントを遅延読み込みに対応させるためのコンテナ
function createPopupBodySuspense({cache, credential, login, prefers, service}) {
  async function props() {
    const [bookmarks, {count, wkfls}] = await Promise.all([
      cache.bookmarks(),
      cache.wkfllist()
    ]);

    return Object.assign({
      bookmarks, count, wkfls,
      openForm(event, form) {
        event.preventDefault();
        service.openForm(form);
      },
      openSeekWait() {
        service.openSeekWait();
      }
    }, await prefers.load());
  }

  let component = null;

  return ({loading}) => {
    if (!loading && component) {
      return component;
    }

    throw (new Promise(async (resolve) => {
      if ((await credential.load()).empty()) {
        resolve(<Info.NoSettings/>);
      } else {
        try {
          if (await login()) {
            resolve(<PopupBody {...(await props())}/>);
          } else {
            resolve(<Info.LoginFailed/>);
          }
        } catch(e) {
          resolve(<Info.NetworkError/>);
        }
      }
    })).then((newComponent) => component = newComponent);
  };
}

// ポップアップの表示処理
chrome.runtime.getBackgroundPage(async (bgPage) => {
  const PopupBodySuspense = createPopupBodySuspense(bgPage);
  const openSite = () => bgPage.service.openSite();
  const openHelp = () => bgPage.service.openHelp();

  const Popup = () => {
    // ローディング状態の管理用
    const [loading, setLoading] = useState(false);
    const update = () => {
      setLoading(true);
      bgPage.update().then(() => setLoading(false));
    };

    return (
      <div>
        <header>
          <button className="btn" onClick={openHelp}>？</button>
          <button className="btn" onClick={update} disabled={loading}>更新</button>
          <button className="link" onClick={openSite}>X-pointを開く</button>
        </header>
        <Suspense fallback={<Spinner/>}>
          <PopupBodySuspense loading={loading}/>
        </Suspense>
      </div>
    );
  };

  ReactDOM.render(<Popup/>, document.getElementById('popup-app'));
});
