import iconv from 'iconv-lite';

export default async ({domCd, user, pass}) => {
  const params = new URLSearchParams({loginType: 0, domCd, user, pass});
  const resp = await fetch('https://xpt.gmo-media.jp/xpoint/login.do', {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} - ${resp.statusText}`);
  }

  return !(await resp.text()).includes(
    iconv.encode('入力内容を確認してください', 'cp932')
  );
};
