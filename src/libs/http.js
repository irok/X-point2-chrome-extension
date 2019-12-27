async function request(url, options = {}) {
  // タイムアウトをコントロールする
  const controller = new AbortController();
  options.signal = controller.signal;
  setTimeout(() => { controller.abort(); }, 2000);

  // 通信エラーは例外を投げる (awaitによりrejectがthrowされる)
  const resp = await fetch(url, options);
  if (!resp.ok) {
    // 200 OK 以外は例外を投げる
    throw new Error(`${resp.status} - ${resp.statusText}`);
  }

  // 生データとcharsetを取り出し
  const blob = await resp.blob();
  const charset = resp.headers.get('Content-Type').split(/;\s*/)
    .filter(part => /^charset=/.test(part))[0]
    .split('=')[1];

  // FileReaderで文字コード変換して返す
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob, charset);
  });
}

export default {
  get(url_, data = {}) {
    const url = new URL(url_);
    url.search = new URLSearchParams(data);
    return request(url);
  },

  post(url, data = {}, options = {}) {
    const params = new URLSearchParams(data);
    return request(url, {
      cache: 'no-cache',
      credentials: 'include',
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
  }
};
