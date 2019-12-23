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

// 承認待ちのワークフローを取得してキャッシュする
async function updatePendingApproval() {
  const {wlist: {dinfo}} = await service.getWkflCnt();
  chrome.browserAction.setBadgeText({
    text: wlist.dinfo.length.toString()
  });
  await cache.wkfllist(dinfo);
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
