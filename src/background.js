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

// 承認待ちの数をバッジに表示する
async function showPendingApprovalCount() {
  const wkflCnt = await service.getWkflCnt();
  const wkflList = Array.prototype.slice.call(wkflCnt.querySelectorAll('wkfl'));
  const wkfl = wkflList.filter(_ => _.querySelector('type').textContent === '0')[0];
  if (wkfl) {
    chrome.browserAction.setBadgeText({
      text: wkfl.querySelector('count').textContent
    });
  }
}

// Chrome起動時および定期的に実行する処理
async function update() {
  try {
    await service.login(await credential.load());
    showPendingApprovalCount();
  } catch(e) {}
}

chrome.alarms.create({
  periodInMinutes: 5
});
chrome.alarms.onAlarm.addListener(update);

chrome.runtime.onStartup.addListener(update);
