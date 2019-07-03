import Credential from './credential';
import login from './login';
import storage from './storage';

Object.assign(window, {
  credential: {
    keys: ['domCd', 'user', 'pass'],
    load() {
      return Credential.retrieve(storage);
    },
    create(data) {
      return (new Credential(storage)).assign(data);
    }
  },
  login
});
