// フォームを開くリンクがクリックされたら、横取りして新規ウィンドウで開く
function intercept(event) {
  const node = event.target;
  if (node.nodeType === Node.ELEMENT_NODE) {
    switch (node.tagName) {
    case 'A': interceptA(event, node); break;
    case 'TD': interceptTD(event, node); break;
    case 'SPAN':
    case 'IMG':
      const td = getAncestorTD(node);
      if (td) {
        interceptTD(event, td);
      }
      break;
    }
  }
}

// td > span, td > img, td > span > span, td > span > img のようなパターンでtdを探し出して返す
function getAncestorTD({parentNode}) {
  if (parentNode.tagName === 'TD') {
    return parentNode;
  }
  if (parentNode.tagName === 'SPAN') {
    return getAncestorTD(parentNode);
  }
  return null;
}

// javascript:リンクのパターンを代替する
// デフォルトアクションをキャンセルする必要がある
function interceptA(event, node) {
  const href = node.getAttribute('href');

  // for newEntForm()
  if (/^javascript:newEntForm\(/.test(href)) {
    event.preventDefault();
    const [fid, routeid, writerid, condroute, hsize, wsize] = getArgsFromJSlink(href);
    const url = `/xpoint/form.do?act=newEnt&fid=${fid}&routeid=${routeid}&writerid=${writerid}&condroute=${condroute}`;
    return openForm(url, hsize, wsize);
  }

  // for openForm(), openFormNoSize(), openFormNoResize()
  if (/^javascript:openForm(?:No(?:S|Res)ize)?\(/.test(href)) {
    event.preventDefault();
    const [url, undefined, height, width] = getArgsFromJSlink(href);
    return openForm(url, height, width);
  }

  // wfOpenForm()
  if (/^javascript:wfOpenForm\(/.test(href)) {
    event.preventDefault();
    const [action, undefined, height, width] = getArgsFromJSlink(href);
    const conChk = document.getElementById('isContinue');
    const [cnt, nxt] = conChk?.checked ? [1, 0] : [0, 1];
    return openForm(`${action}&isContinue=${cnt}&isNextOnly=${nxt}&isWait=1&initContinue=1`, height, width);
  }
}

// td.onclickのパターンを代替する
function interceptTD(event, node) {
  const href = node.getAttribute('onclick');

  // openXpForm()
  if (/^openXpForm\(/.test(href)) {
    event.stopPropagation();
    const [action, undefined, height, width] = getArgsFromJSlink(href);
    const apl = document.forms[0].serialApply.checked ? 1 : 0;
    return openForm(`${action}&serialApply=${apl}`, height, width);
  }
}

// フォームウィンドウを開く
function openForm(url, height, width) {
  const size = height ? `height=${height},width=${width},` : '';
  window.open(url, '_blank', `${size}scrollbars=yes,resizable=yes,top=0,left=0`);
}

// javascript:fn(...) の引数リストを返す
function getArgsFromJSlink(href) {
  return href.slice(href.indexOf('(') + 1, href.lastIndexOf(')'))
    .split(/,/)
    .map(_ => /^\s*\x27/.test(_) ? _.slice(_.indexOf("'") + 1, _.lastIndexOf("'")) : _);
}

// window.onload後に動的に設定されるリンクもフックするため、documentでイベントを受ける
// 要素のonclickよりも先に処理するため、キャプチャフェーズで処理する
document.addEventListener('click', intercept, true);
