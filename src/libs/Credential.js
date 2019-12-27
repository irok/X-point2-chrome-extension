import crypt from './crypt';

const defaultValues = {
  domCd: '001',
  user: '',
  encpass: ''
};

export default class Credential {
  static get keys() {
    return ['domCd', 'user', 'pass'];
  }

  static async retrieve(storage) {
    const props = await storage.getSync(defaultValues);
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
    await this.storage.setSync({domCd, user, encpass});
  }

  empty() {
    return this.user === '' && this.pass === '';
  }
}
