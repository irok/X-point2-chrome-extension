export default class Credential {
  static async retrieve(storage) {
    // 取り出したいキー、及びデフォルト値（ストレージになかった時に返される）を渡す
    const props = await storage.get({
      domCd: '001',
      user: '',
      pass: ''
    });

    return (new Credential(storage)).assign(props);
  }

  constructor(storage) {
    this.storage = storage;
    this.props = {};
  }

  assign(props) {
    this.props = {...props};
  }

  async save() {
    await this.storage.set(this.props);
  }
}
