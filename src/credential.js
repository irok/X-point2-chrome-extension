const defaultValues = {
  domCd: '001',
  user: '',
  pass: ''
};

export default class Credential {
  static async retrieve(storage) {
    const props = await storage.get(defaultValues);
    return (new Credential(storage)).assign(props);
  }

  constructor(storage) {
    this.storage = storage;
  }

  assign({domCd, user, pass}) {
    Object.assign(this, {domCd, user, pass});
    return this;
  }

  async save() {
    const {domCd, user, pass} = this;
    await this.storage.set({domCd, user, pass});
  }
}
