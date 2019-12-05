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

// 承認待ちのワークフローを取得する
async function updatePendingApproval() {
  const {wkflcnt} = await service.getWkflCnt();
  const wkfl = wkflcnt.wkfl.filter(_ => _.type._text === '0')[0];
  if (wkfl) {
    chrome.browserAction.setBadgeText({
      text: wkfl.count._text
    });
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
