import React from 'react';

export default ({bookmarks, onClickForm}) => {
  const body = bookmarks.length === 0 ? (
    <p className="info">
      X-pointのブックマーク機能に登録したフォームがここに表示されます。<br/>
      よく使うフォームがあれば登録してみてください。
    </p>
  ) : (
    <ul className="section-body">{
      bookmarks.map((bkm, index) => (
        <li key={index}>
          <a href={bkm.url} onClick={(event) => onClickForm(event, bkm)}>{bkm.title}</a>
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
