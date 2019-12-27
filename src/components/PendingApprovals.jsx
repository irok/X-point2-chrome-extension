import React from 'react';

export default ({wkfllist, onClick}) => {
  const count = wkfllist.length;
  const body = count === 0 ? (
    <p className="info">
      承認待ちの申請はありません。
    </p>
  ) : (
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
