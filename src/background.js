import Credential from './credential';
import Service from './service';
import WkflList from './wkfllist';
import http from './http';
import storage from './storage';

Object.assign(window, {
  cache: {
    wkfllist(data = null) {
      return (new WkflList(storage)).cache(data);
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
  service: new Service(http)
});

// 承認待ちのワークフローを取得する
async function updatePendingApproval() {
  const {wkflcnt} = await service.getWkflCnt();
  if (Array.isArray(wkflcnt.wkfl)) {
    const wkfl = wkflcnt.wkfl.filter(w => w.type._ === '0')[0];
    if (wkfl) {
      chrome.browserAction.setBadgeText({
        text: wkfl.count._
      });

      // 申請内容をキャッシュする
      await cache.wkfllist(wkflcnt.wlist && wkflcnt.wlist.dinfo);
    }
  }
}

// Chrome起動時および定期的に実行する処理
async function update() {
  try {
    await service.login(await credential.load());
    await updatePendingApproval();
  } catch(e) {}
}

// イベント設定
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('overwatch', {
    periodInMinutes: 5
  });
});
chrome.alarms.onAlarm.addListener(update);
chrome.runtime.onStartup.addListener(update);
