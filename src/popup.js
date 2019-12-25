import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './popup.scss';

const FormLinks = ({bookmarks, onClick}) => {
  const body = bookmarks.length === 0 ? null : (
    <ul className="section-body">{
      bookmarks.map((bkm, index) => (
        <li key={index}>
          <a href={bkm.url} onClick={(event) => onClick(event, bkm)}>{bkm.title}</a>
        </li>
      ))
    }</ul>
  );

  return (
    <section id="form-links">
      <h1>提出</h1>
      {body}
    </section>
  );
};

const PendingApprovals = ({wkfllist, onClick}) => {
  const count = wkfllist.length;
  const body = count === 0 ? null : (
    <div className="section-body">
      <table>
        <tbody>{
          wkfllist.map((wkfl, index) => (
            <tr key={index}>
              <td>
                <a href={wkfl.url} onClick={(event) => onClick(event, wkfl)}>{wkfl.doctitle}</a>
              </td>
              <td>{wkfl.docname}<br/>{wkfl.writer}</td>
              <td>{wkfl.date}<br/>{wkfl.time}</td>
            </tr>
          ))
        }</tbody>
      </table>
    </div>
  );

  return (
    <section id="pending-approvals">
      <h1>承認待ち ({count})</h1>
      {body}
    </section>
  );
};

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

ReactDOM.render(<PopupApp />, document.getElementById('popup-app'));
