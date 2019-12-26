import Cache from './Cache';

export default class BookmarksCache extends Cache {
  static defaultValues() {
    return  {
      bookmarks: []
    };
  }

  constructor(storage) {
    super(storage);
  }

  // return Promise
  async get() {
    return (await this._get()).bookmarks;
  }

  // return Promise
  set(bookmarks) {
    return this._set({bookmarks});
  }
}
