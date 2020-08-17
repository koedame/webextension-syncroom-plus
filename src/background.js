import store from './store';
import axios from 'axios';

global.browser = require('webextension-polyfill');

// アイコンクリック時のアクション
browser.browserAction.onClicked.addListener(function () {
  browser.tabs.create({
    url: 'https://syncroom.yamaha.com/play/',
    active: true,
  });
});

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');

// 参考: https://qiita.com/sakuraya/items/33f93e19438d0694a91d
const userAgent = window.navigator.userAgent.toLowerCase();
let currentBrowser;
if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
  currentBrowser = 'InternetExplorer';
} else if (userAgent.indexOf('edge') !== -1) {
  currentBrowser = 'Edge';
} else if (userAgent.indexOf('chrome') !== -1) {
  currentBrowser = 'GoogleChrome';
} else if (userAgent.indexOf('safari') !== -1) {
  currentBrowser = 'Safari';
} else if (userAgent.indexOf('firefox') !== -1) {
  currentBrowser = 'FireFox';
} else if (userAgent.indexOf('opera') !== -1) {
  currentBrowser = 'Opera';
} else {
  currentBrowser = 'unknown';
}

setInterval(() => {
  // 他のscriptから変更されたものはreactiveにならないので、最初にfetchしておく
  store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');

  // 通知登録がある場合のみ実行
  const notificationVacancyRooms = store.getters['notificationVacancyRooms/rooms'];

  if (notificationVacancyRooms.length !== 0) {
    axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then((res) => {
      const rooms = res.data.rooms;

      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];

        // 空き通知
        if (room.num_members < 5) {
          const uid = `${room.create_time}||${room.room_name}`;
          const isExistNotificationVacancyRooms = notificationVacancyRooms.find((r) => r.uid === uid);
          if (isExistNotificationVacancyRooms) {
            const options = {
              type: 'basic',
              iconUrl: 'icons/icon_128.png',
              title: `ルーム名：${room.room_name}`,
              message: '空きがでました',
            };

            if (currentBrowser === 'GoogleChrome') {
              // このオプションはGoogleChromeしか対応していないので判定して追加する
              // 参考: https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/notifications/NotificationOptions
              options.requireInteraction = true;
            }
            browser.notifications.create(`vacancy::${uid}`, options);
          }
        }
      }

      // roomがなくなっていれば通知を削除
      for (let i = 0; i < notificationVacancyRooms.length; i++) {
        if (!rooms.find((r) => `${r.create_time}||${r.room_name}` === notificationVacancyRooms[i].uid)) {
          store.dispatch('notificationVacancyRooms/removeNotificationByUID', notificationVacancyRooms[i].uid);
          // 通知が残っていれば消しておく
          browser.notifications.clear(notificationVacancyRooms[i].uid);
        }
      }
    });
  }
}, 1000);

const makeJoinUri = (roomName, pass, pid, mode) => {
  var urienc = function (str) {
    return encodeURIComponent(str).replace(/[!*'()]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  var str = 'joingroup?mode=' + urienc(mode) + '&pid=' + urienc(pid) + '&nickname=&groupname=' + urienc(roomName) + '&password=' + urienc(pass);
  var uri = 'syncroom:';
  var tbl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var len = str.length;
  var mod = len % 3;
  if (mod > 0) len -= mod;

  var i, t;
  for (i = 0; i < len; i += 3) {
    t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += tbl.charAt((t >> 6) & 0x3f);
    uri += tbl.charAt(t & 0x3f);
  }
  if (mod === 2) {
    t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8);
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += tbl.charAt((t >> 6) & 0x3f);
    uri += '=';
  } else if (mod === 1) {
    t = str.charCodeAt(i + 0) << 16;
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += '=';
    uri += '=';
  }

  return uri;
};

browser.notifications.onClicked.addListener((notificationId) => {
  const splittedNotificationId = notificationId.split('::');
  const actionType = splittedNotificationId[0];
  const uid = splittedNotificationId[1];

  if (actionType === 'vacancy') {
    const roomName = uid.split('||')[1];
    axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then((res) => {
      const room = res.data.rooms.find((room) => room.room_name === roomName);

      if (room.need_passwd) {
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');
        if (pwPrompt) {
          browser.tabs.create({
            url: makeJoinUri(roomName, pwPrompt, 4, 2),
            active: true,
          });
        }
      } else {
        browser.tabs.create({
          url: makeJoinUri(roomName, '', 4, 2),
          active: true,
        });
      }
    });

    store.dispatch('notificationVacancyRooms/removeNotificationByUID', uid);
  }

  browser.notifications.clear(notificationId);
});

browser.notifications.onClosed.addListener((notificationId) => {
  const splittedNotificationId = notificationId.split('::');
  const actionType = splittedNotificationId[0];
  const uid = splittedNotificationId[1];

  if (actionType === 'vacancy') {
    store.dispatch('notificationVacancyRooms/removeNotificationByUID', uid);
  }

  browser.notifications.clear(notificationId);
});
