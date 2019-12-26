function getData(type, props) {
  return new Promise((resolve) => {
    chrome.storage[type].get(props, resolve);
  });
}

function setData(type, props) {
  return new Promise((resolve) => {
    chrome.storage[type].set(props, resolve);
  });
}

export default {
  get: getData.bind(null, 'local'),
  set: setData.bind(null, 'local'),
  getSync: getData.bind(null, 'sync'),
  setSync: setData.bind(null, 'sync'),
};
