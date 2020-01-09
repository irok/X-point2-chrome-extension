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
    const crdt = await credential.load();
    if (crdt.empty()) {
      return false;
    }
    return await service.isAuthenticated() || await service.login(crdt);
  },
  service: new Service(http),
  update
};
Object.assign(window, bgPage);

// ブックマークを取得してキャッシュする
async function updateBookmarks() {
  const bookmarks = await bgPage.service.getBookmarkList();
  await cache.bookmarks(bookmarks);
}

// 承認待ちのワークフローを取得してキャッシュする
async function updatePendingApproval() {
  const {count: {type0}, wlist: {dinfo}} = await bgPage.service.getWkflCnt();
  await cache.wkfllist({
    count: type0,
    wkfls: dinfo
  });
}

// 最新の情報を取り込む
async function update() {
  try {
    if (await bgPage.login()) {
      await Promise.all([
        updateBookmarks(),
        updatePendingApproval()
      ]);
    }
  } catch(e) {};

  const {count} = await cache.wkfllist();
  chrome.browserAction.setBadgeText({
    text: count === 0 ? '' : '' + count
  });
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
  } else {
    // それ以外ならキャッシュを更新してバッジを表示
    await update();
  }
});

chrome.runtime.onStartup.addListener(async function() {
  chrome.alarms.create('overwatch', {
    periodInMinutes: 5
  });
  await update();
});

chrome.alarms.onAlarm.addListener(async () => await update());
