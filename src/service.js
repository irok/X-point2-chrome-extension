export default class Service {
  static url(pathname) {
    return `https://xpt.gmo-media.jp${pathname}`;
  }

  constructor(http) {
    this.http = http;
  }

  _get(url, data) {
    return this.http.get(Service.url(url), data);
  }

  _post(url, data, options) {
    return this.http.post(Service.url(url), data, options);
  }

  openSite() {
    window.open(Service.url('/xpoint/login.jsp?login=site'), '_blank');
  }

  async login({domCd, user, pass, loginType = 0}, options = {}) {
    const data = {domCd, user, pass, loginType};
    const text = await this._post('/xpoint/login.do', data, options);
    return !text.includes('入力内容を確認してください');
  }

  async authenticate(credential) {
    return await this.login(credential, {credentials: 'omit'});
  }
}
