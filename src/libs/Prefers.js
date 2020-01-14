const defaultValues = {
  showPendingApprovals: true,
};

export default class Prefers {
  static async retrieve(storage) {
    const props = await storage.getSync(defaultValues);
    return (new Prefers(storage)).assign(props);
  }

  constructor(storage) {
    this.storage = storage;
  }

  assign(data = {}) {
    // 固有のプロパティをのみをアサインする
    Object.assign(this, Object.fromEntries(
      Object.entries(data).filter(([key]) => defaultValues.hasOwnProperty(key))
    ));
    return this;
  }

  async save() {
    // 固有のプロパティをのみを保存する
    await this.storage.setSync(Object.fromEntries(
      Object.keys(defaultValues).map((key) => [key, this[key]])
    ));
  }
}
