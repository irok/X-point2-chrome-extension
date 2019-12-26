import React, {Component} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default class PopupApp extends Component {
  static async loadBookmarks({credential, service}) {
    try {
      const crdt = await credential.load();
      await service.login(crdt);
      return await service.getBookmarkList();
    } catch(e) {}
  }

  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
      wkfllist: []
    };
    chrome.runtime.getBackgroundPage(this.init.bind(this));
  }

  async init(bgPage) {
    Promise.all([
      this.constructor.loadBookmarks(bgPage),
      bgPage.cache.wkfllist()
    ]).then(([bookmarks, wkfllist]) => {
      this.setState({bookmarks, wkfllist});
    });
  }

  render() {
    return (
      <div>
        <header>
          <button onClick={this.handleClickOpenSite}>
            X-pointを開く
          </button>
        </header>
        <FormLinks
          bookmarks={this.state.bookmarks}
          onClick={this.handleClickFormLink}
        />
        <PendingApprovals
          wkfllist={this.state.wkfllist}
          onClick={this.handleClickPendingApproval}
        />
      </div>
    );
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
