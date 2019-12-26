import Credential from './libs/Credential';
import Service from './libs/Service';
import WkflListCache from './libs/WkflListCache';
import http from './libs/http';
import storage from './libs/storage';

Object.assign(window, {
  cache: {
    wkfllist(data = null) {
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
  service: new Service(http)
});

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
  try {
    await service.login(await credential.load());
    await updatePendingApproval();
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
