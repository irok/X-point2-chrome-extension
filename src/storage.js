export default {
  get(props) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(props, resolve);
    });
  },

  set(props) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(props, resolve);
    });
  }
};
