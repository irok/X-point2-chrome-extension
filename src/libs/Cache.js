export default class Cache {
  constructor(storage) {
    this.storage = storage;
  }

  // return Promise
  async cache(data) {
    if (typeof data !== 'undefined') {
      this.set(data);
      return;
    }
    return this.get();
  }

  // return Promise
  _get() {
    return this.storage.get(this.constructor.defaultValues());
  }

  // return Promise
  _set(data) {
    this.storage.set(data);
  }
}
