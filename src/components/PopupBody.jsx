import React, {Fragment} from 'react';
import FormLinks from './FormLinks.jsx';
import PendingApprovals from './PendingApprovals.jsx';

export default (props) => (
  <Fragment>
    <FormLinks
      bookmarks={props.bookmarks}
      onClickForm={props.openForm}
    />
    <PendingApprovals
      count={props.count}
      wkfls={props.wkfls}
      onClickForm={props.openForm}
      onClickMore={props.openSeekWait}
    />
  </Fragment>
);
