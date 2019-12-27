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
    service.login(await credential.load());
  },
  service: new Service(http)
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
  chrome.browserAction.setBadgeText({
    text: dinfo.length.toString()
  });
  await cache.wkfllist(dinfo);
}

// 状態をアップデートする
async function update() {
  const {login} = bgPage;
  try {
    await login();
    await Promise.all([
      cache.bookmarks(null),
      cache.wkfllist(null)
    ]);
  } catch(e) {}
}

// 初期化処理
async function setup() {
  chrome.alarms.create('overwatch', {
    periodInMinutes: 5
  });
  await update();
}

// イベント設定
chrome.runtime.onInstalled.addListener(setup);
chrome.runtime.onStartup.addListener(setup);
chrome.alarms.onAlarm.addListener(update);
