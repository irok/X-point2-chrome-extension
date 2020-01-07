import React, {Fragment} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default (props) => (
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
