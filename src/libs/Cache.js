export default class Cache {
  constructor(storage) {
    this.storage = storage;
  }

  // return Promise
  async cache(data) {
    if (typeof data === 'undefined') {
      return this.get();
    }

    if (data === null) {
      data = this.constructor.defaultValues();
    }
    return this.set(data);
  }

  // return Promise
  get() {
    return this.storage.get(this.constructor.defaultValues());
  }

  // return Promise
  set(data) {
    this.storage.set(data);
  }
}
