import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const FormLinks = ({bookmarks, onClick}) => {
  const body = bookmarks.length === 0 ? null : (
    <ul>{
      bookmarks.map((bkm, index) => (
        <li key={index}>
          <a href={bkm.url} onClick={(event) => onClick(event, bkm)}>{bkm.title}</a>
        </li>
      ))
    }</ul>
  );

  return (
    <section>
      <h1>提出</h1>
      {body}
    </section>
  );
};

const PendingApprovals = ({wkfllist, onClick}) => {
  const count = wkfllist.length;
  const body = count === 0 ? null : (
    <table>
      <tbody>{
        wkfllist.map((wkfl, index) => (
          <tr key={index}>
            <td>
              <a onClick={(event) => onClick(event, wkfl)}>{wkfl.doctitle._}</a>
            </td>
            <td>{wkfl.docname._}</td>
            <td>{wkfl.writer._}</td>
            <td dangerouslySetInnerHTML={{__html: wkfl.wdate._}}/>
          </tr>
        ))
      }</tbody>
    </table>
  );

  return (
    <section>
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
      service.openForm({
        pathname: `/xpoint/form.do?act=view&docid=${wkfl.docid._}&fid=${wkfl.fid._}`,
        height: wkfl.wheight._,
        width: wkfl.wwidth._
      });
    });
  }
}

ReactDOM.render(<PopupApp />, document.getElementById('popup-app'));
