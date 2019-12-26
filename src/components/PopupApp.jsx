import React, {Component} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default class PopupApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
      wkfllist: []
    };
    chrome.runtime.getBackgroundPage(this.init.bind(this));
  }

  async init({cache, login}) {
    try {
      await login();
      const [bookmarks, wkfllist] = await Promise.all([
        cache.bookmarks(),
        cache.wkfllist()
      ]);
      this.setState({bookmarks, wkfllist});
    } catch(e) {}
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
