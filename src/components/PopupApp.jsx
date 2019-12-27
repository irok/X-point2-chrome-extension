import React, {Component} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

const STATUS = {
  NONE: 0,
  AUTHORIZED: 1,
  UNAUTHORIZED: 2,
  UNINITIALIZED: 3,
  NETWORK_ERROR: 4
};

export default class PopupApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: STATUS.NONE,
      bookmarks: [],
      wkfllist: []
    };
    chrome.runtime.getBackgroundPage(this.update.bind(this));
  }

  async update({cache, credential, login}) {
    const newState = {};
    try {
      if ((await credential.load()).user === '') {
        newState.status = STATUS.UNINITIALIZED;
      } else if (await login()) {
        const [bookmarks, wkfllist] = await Promise.all([
          cache.bookmarks(),
          cache.wkfllist()
        ]);
        Object.assign(newState, {
          status: STATUS.AUTHORIZED,
          bookmarks, wkfllist
        });
      } else {
        newState.status = STATUS.UNAUTHORIZED;
      }
    } catch(e) {
      newState.status = STATUS.NETWORK_ERROR;
    }
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <header>
          <button onClick={this.handleClickOpenSite}>
            X-pointを開く
          </button>
        </header>
        {this.body()}
      </div>
    );
  }

  body() {
    switch (this.state.status) {
    case STATUS.AUTHORIZED:
      return (
        <React.Fragment>
          <FormLinks
            bookmarks={this.state.bookmarks}
            onClick={this.handleClickFormLink}
          />
          <PendingApprovals
            wkfllist={this.state.wkfllist}
            onClick={this.handleClickPendingApproval}
          />
        </React.Fragment>
      );
    case STATUS.UNAUTHORIZED:
      return <p className="info">ログインできませんでした。</p>;
    case STATUS.UNINITIALIZED:
      return <p className="info">アイコンを右クリックし、オプションからログイン情報を設定してください。</p>;
    case STATUS.NETWORK_ERROR:
      return <p className="info">ネットワークエラーが発生しました。社外の場合はVPNを確認してください。</p>;
    default:
      return null;
    }
  }

  handleClickOpenSite() {
    chrome.runtime.getBackgroundPage(({service}) => {
      service.openSite();
    });
  }

  handleClickFormLink(event, bkm) {
    event.preventDefault();
    chrome.runtime.getBackgroundPage(({service}) => {
      service.openForm(bkm);
    });
  }

  handleClickPendingApproval(event, wkfl) {
    event.preventDefault();
    chrome.runtime.getBackgroundPage(({service}) => {
      service.openForm(wkfl);
    });
  }
}
