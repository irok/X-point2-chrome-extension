import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import Info from './components/Info.jsx';
import PopupBody from './components/PopupBody.jsx';
import Spinner from "./components/Spinner.jsx";
import './popup.scss';

function createPopupBodySuspense({cache, credential, login, service}) {
  async function props() {
    const [bookmarks, wkfllist] = await Promise.all([
      cache.bookmarks(),
      cache.wkfllist()
    ]);

    return {
      bookmarks, wkfllist,
      openForm(event, form) {
        event.preventDefault();
        service.openForm(form);
      }
    };
  }

  let component = null;

  return () => {
    if (component) {
      return component;
    }

    throw (new Promise(async (resolve) => {
      if ((await credential.load()).user === '') {
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
