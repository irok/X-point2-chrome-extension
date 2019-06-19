import crypt from './crypt';

const defaultValues = {
  domCd: '001',
  user: '',
  encpass: ''
};

export default class Credential {
  static async retrieve(storage) {
    const props = await storage.get(defaultValues);
    props.pass = props.encpass ? crypt.decrypt(props.encpass) : '';
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
    const encpass = crypt.encrypt(pass);
    await this.storage.set({domCd, user, encpass});
  }
}
