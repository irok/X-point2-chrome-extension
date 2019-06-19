import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import WordArray from 'crypto-js/lib-typedarrays';

function newSecret() {
  return WordArray.random(128 / 8).toString(Base64);
}

export default {
  decrypt(encrypted) {
    const [cipher, secret] = encrypted.split(/:/);
    return AES.decrypt(cipher, secret).toString(Utf8);
  },
  encrypt(plaintext) {
    const secret = newSecret();
    const cipher = AES.encrypt(plaintext, secret).toString();
    return `${cipher}:${secret}`;
  }
};
