import React, {Fragment} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default (props) => {
  const body = props.error ? (
    <p className="info">{props.error}</p>
  ) : (
    <Fragment>
      <FormLinks
        bookmarks={props.bookmarks}
        onClick={props.openForm}
      />
      <PendingApprovals
        wkfllist={props.wkfllist}
        onClick={props.openForm}
      />
    </Fragment>
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
