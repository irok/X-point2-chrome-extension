import React from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default (props) => {
  const body = props.error ? (
    <p className="info">{props.error}</p>
  ) : (
    <React.Fragment>
      <FormLinks
        bookmarks={props.bookmarks}
        onClick={props.openForm}
      />
      <PendingApprovals
        wkfllist={props.wkfllist}
        onClick={props.openForm}
      />
    </React.Fragment>
  );

  return (
    <div>
      <header>
        <button onClick={props.openSite}>
          X-pointを開く
        </button>
      </header>
      {body}
    </div>
  );
};
