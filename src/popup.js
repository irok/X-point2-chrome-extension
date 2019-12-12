import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const FormLinks = (props) => (
  props.bookmarks.map((bkm, index) => (
    <p key={index}>
      <a href={bkm.url} onClick={(event) => props.onClick(event, bkm)}>
        {bkm.title}
      </a>
    </p>
  ))
);

class PopupApp extends Component {
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
    const bookmarks = await this.constructor.loadBookmarks(bgPage);
    const wkfllist = await bgPage.cache.wkfllist()
    this.setState({
      bookmarks, wkfllist
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClickOpenSite}>
          X-pointを開く
        </button>
        <FormLinks
          bookmarks={this.state.bookmarks}
          onClick={this.handleClickFormLink}
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
}

ReactDOM.render(<PopupApp />, document.getElementById('popup-app'));
