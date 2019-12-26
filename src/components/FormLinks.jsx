import React from 'react';

export default ({bookmarks, onClick}) => {
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
