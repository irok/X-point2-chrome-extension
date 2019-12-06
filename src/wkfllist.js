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
    if (!wkfllist) {
      wkfllist = [];
    }
    else if (!Array.isArray(wkfllist)) {
      wkfllist = [wkfllist];
    }
    return this._set({wkfllist});
  }
}
