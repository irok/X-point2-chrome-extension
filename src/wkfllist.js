import Cache from './cache';

export default class WkflList extends Cache {
  static defaultValues() {
    return  {
      wkfllist: []
    };
  }

  constructor(storage) {
    super(storage);
  }

  // return Promise
  async get() {
    return (await this._get()).wkfllist;
  }

  // return Promise
  set(wkfllist) {
    // 要素がなければキャッシュをクリアする（空配列で上書き）
    if (!wkfllist) {
      wkfllist = [];
    }
    // 要素が1つのときは単一オブジェクトになるので配列にする
    else if (!Array.isArray(wkfllist)) {
      wkfllist = [wkfllist];
    }

    return this._set({wkfllist});
  }
}
