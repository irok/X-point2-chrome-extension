import Cache from './Cache';

export default class BookmarksCache extends Cache {
  static defaultValues() {
    return {
      bookmarks: []
    };
  }

  constructor(storage) {
    super(storage);
  }

  // return Promise
  async get() {
    return (await super.get()).bookmarks;
  }

  // return Promise
  set(bookmarks) {
    // 要素がなければキャッシュをクリアする
    if (!bookmarks) {
      bookmarks = [];
    }
    return super.set({bookmarks});
  }
}
