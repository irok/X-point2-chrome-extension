export default class Cache {
  constructor(storage) {
    this.storage = storage;
  }

  // return Promise
  async cache(data = null) {
    return data ? this.set(data) : this.get();
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
