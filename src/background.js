import BookmarksCache from './libs/BookmarksCache';
import Credential from './libs/Credential';
import Service from './libs/Service';
import WkflListCache from './libs/WkflListCache';
import http from './libs/http';
import storage from './libs/storage';

const bgPage = {
  cache: {
    bookmarks(data) {
      return (new BookmarksCache(storage)).cache(data);
    },
    wkfllist(data) {
      return (new WkflListCache(storage)).cache(data);
    }
  },
  credential: {
    keys: Credential.keys,
    load() {
      return Credential.retrieve(storage);
    },
    create(data) {
      return (new Credential(storage)).assign(data);
    }
  },
  async login() {
    const {credential, service} = bgPage;
    return await service.login(await credential.load());
  },
  service: new Service(http),
  update
};
Object.assign(window, bgPage);

// ブックマークを取得してキャッシュする
async function updateBookmarks() {
  const bookmarks = await service.getBookmarkList();
  await cache.bookmarks(bookmarks);
}

// 承認待ちのワークフローを取得してキャッシュする
async function updatePendingApproval() {
  const {wlist: {dinfo}} = await service.getWkflCnt();
  await cache.wkfllist(dinfo);
}

// 最新の情報を取り込む
async function update() {
  const {login} = bgPage;
  const badge = {text: ''};

  try {
    if (await login()) {
      await Promise.all([
        updateBookmarks(),
        updatePendingApproval()
      ]);
      badge.text = (await cache.wkfllist()).length.toString();
    }
  } catch(e) {};

  chrome.browserAction.setBadgeText(badge);
}

// イベント設定
chrome.runtime.onInstalled.addListener(async function({reason}) {
  // 再インストールしたとき、ローカルキャッシュが残っていることがあるのでクリアする
  if (reason === 'install') {
    const {cache} = bgPage;
    await Promise.all([
      cache.bookmarks(null),
      cache.wkfllist(null)
    ]);
  }
});

chrome.runtime.onStartup.addListener(async function() {
  chrome.alarms.create('overwatch', {
    periodInMinutes: 5
  });
  await update();
});

chrome.alarms.onAlarm.addListener(update);
