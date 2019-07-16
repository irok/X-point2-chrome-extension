import Credential from './credential';
import Service from './service';
import http from './http';
import storage from './storage';

Object.assign(window, {
  credential: {
    keys: Credential.keys,
    load() {
      return Credential.retrieve(storage);
    },
    create(data) {
      return (new Credential(storage)).assign(data);
    }
  },
  service: new Service(http)
});
