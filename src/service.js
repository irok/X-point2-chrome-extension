import {xml2js} from 'xml-js';

const regexBookmarkParser = /<a href="javascript:openForm\('([^']+)','[^']+','(\d+)','(\d+)'\);" target="">(.+?)<\/a>/g;

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

  openForm({pathname, height, width}) {
    window.open(Service.url(pathname), '_blank', `height=${height},width=${width}`);
  }

  async login({domCd, user, pass, loginType = 0}, options = {}) {
    const data = {domCd, user, pass, loginType};
    const text = await this._post('/xpoint/login.do', data, options);
    return !text.includes('入力内容を確認してください');
  }

  async authenticate(credential) {
    return await this.login(credential, {credentials: 'omit'});
  }

  async getBookmarkList() {
    const text = await this._get('/xpoint/xpoint/front/portlet/bookmarkListPortlet.jsp');
    const results = [];

    let matches;
    while ((matches = regexBookmarkParser.exec(text)) !== null) {
      const [, pathname, height, width, title] = matches;
      results.push({
        pathname, height, width,
        url: Service.url(pathname),
        title: title.replace('（（自動選択ルート））', '')
      });
    }

    return results;
  }

  async getWkflCnt() {
    const xml = await this._get('/xpoint/xpoint/front/getWkflCnt.jsp', {wkfl_list: ''});
    const root = xml2js(xml, {compact: true, textKey: '_'});

    if (root.wkflcnt.wlist && root.wkflcnt.wlist.dinfo) {
      root.wkflcnt.wlist.dinfo = root.wkflcnt.wlist.dinfo.map((wkfl) => {
        const pathname = `/xpoint/form.do?act=view&docid=${wkfl.docid._}&fid=${wkfl.fid._}`;
        const [date, time] = wkfl.wdate._.split('<br>');
        return {
          pathname, date, time,
          docid: wkfl.docid._,
          docname: wkfl.docname._,
          doctitle: wkfl.doctitle._,
          fid: wkfl.fid._,
          height: wkfl.wheight._,
          width: wkfl.wwidth._,
          writer: wkfl.writer._,
          url: Service.url(pathname)
        };
      });
    }

    return root;
  }
}
