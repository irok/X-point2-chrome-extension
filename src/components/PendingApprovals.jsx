import React from 'react';

export default (props) => {
  if (props.count === 0) {
    return (
      <section id="pending-approvals">
        <h1>承認待ち</h1>
        <p className="info">
          承認待ちの申請はありません。
        </p>
      </section>
    );
  }

  return (
    <section id="pending-approvals">
      <h1>
        承認待ち ({props.count})
        {createMore(props)}
      </h1>
      {createBody(props)}
    </section>
  );
};

function createBody({wkfls, onClickForm}) {
  return (
    <div className="section-body">
      <table>
        <tbody>{
          wkfls.map((wkfl, index) => (
            <tr key={index}>
              <td>
                <a href={wkfl.url} onClick={(event) => onClickForm(event, wkfl)}>{wkfl.doctitle}</a>
              </td>
              <td>{wkfl.docname}<br/>{wkfl.writer}</td>
              <td>{wkfl.date}<br/>{wkfl.time}</td>
            </tr>
          ))
        }</tbody>
      </table>
    </div>
  );
}

function createMore({count, wkfls, onClickMore}) {
  return count === wkfls.length ? null : (
    <button className="more" onClick={() => onClickMore()}>全部見る</button>
  );
}
