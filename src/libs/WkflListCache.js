import Cache from './Cache';

export default class WkflListCache extends Cache {
  static defaultValues() {
    return {
      count: 0,
      wkfls: []
    };
  }

  constructor(storage) {
    super(storage);
  }

  // return Promise
  set({count, wkfls} = {}) {
    // 要素がなければキャッシュをクリアする
    if (!count || !wkfls) {
      count = 0;
      wkfls = [];
    }
    return super.set({count, wkfls});
  }
}
