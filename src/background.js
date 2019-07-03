import Credential from './credential';
import login from './login';
import storage from './storage';

Object.assign(window, {
  credential: {
    load() {
      return Credential.retrieve(storage);
    },
    create({domCd, user, pass}) {
      return (new Credential(storage)).assign({domCd, user, pass});
    }
  },
  login
});
