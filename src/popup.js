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
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: []
    };
    chrome.runtime.getBackgroundPage(this.loadBookmarks.bind(this));
  }

  async loadBookmarks({credential, service}) {
    try {
      const crdt = await credential.load();
      await service.login(crdt);

      this.setState({
        bookmarks: await service.getBookmarkList()
      });
    } catch(e) {}
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
        ></FormLinks>
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
