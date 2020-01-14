import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import Info from './components/Info.jsx';
import PopupBody from './components/PopupBody.jsx';
import Spinner from "./components/Spinner.jsx";
import './popup.scss';

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

  return () => {
    if (component) {
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

chrome.runtime.getBackgroundPage(async (bgPage) => {
  const PopupBodySuspense = createPopupBodySuspense(bgPage);
  const Popup = () => (
    <div>
      <header>
        <button onClick={() => bgPage.service.openSite()}>X-pointを開く</button>
      </header>
      <Suspense fallback={<Spinner/>}>
        <PopupBodySuspense/>
      </Suspense>
    </div>
  );

  ReactDOM.render(<Popup/>, document.getElementById('popup-app'));
});
