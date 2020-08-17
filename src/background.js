import store from './store';
import axios from 'axios';

global.browser = require('webextension-polyfill');

// アイコンクリック時のアクション
browser.browserAction.onClicked.addListener(function() {
  browser.tabs.create({
    url: 'https://syncroom.yamaha.com/play/',
    active: true,
  });
});

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');

setInterval(() => {
  // 他のscriptから変更されたものはreactiveにならないので、最初にfetchしておく
  store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');

  // 通知登録がある場合のみ実行
  const notificationVacancyRooms = store.getters['notificationVacancyRooms/rooms'];

  if (notificationVacancyRooms.length !== 0) {
    axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then(res => {
      const rooms = res.data.rooms;

      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];

        // 空き通知
        if (room.num_members < 5) {
          const uid = `${room.create_time}-${room.room_name}`;
          const isExistNotificationVacancyRooms = notificationVacancyRooms.find(r => r.uid === uid);
          if (isExistNotificationVacancyRooms) {
            browser.notifications.create(`vacancy::${uid}`, {
              type: 'basic',
              iconUrl: 'icons/icon_128.png',
              title: `ルーム名：${room.room_name}`,
              message: '空きがでました',
              requireInteraction: true,
            });
          }
        }
      }

      // roomがなくなっていれば通知を削除
      for (let i = 0; i < notificationVacancyRooms.length; i++) {
        if (!rooms.find(r => `${r.create_time}||${r.room_name}` === notificationVacancyRooms[i].uid)) {
          store.dispatch('notificationVacancyRooms/removeNotificationByUID', notificationVacancyRooms[i].uid);
          // 通知が残っていれば消しておく
          browser.notifications.clear(notificationVacancyRooms[i].uid);
        }
      }
    });
  }
}, 1000);

browser.notifications.onClicked.addListener(notificationId => {
  const splittedNotificationId = notificationId.split('::');
  const actionType = splittedNotificationId[0];
  const uid = splittedNotificationId[1];

  if (actionType === 'vacancy') {
    // TODO: 自動でSYNCROOMを開くように
    // TODO: パスワードつきのものはブラウザを経由して開くように
    store.dispatch('notificationVacancyRooms/removeNotificationByUID', uid);
  }

  browser.notifications.clear(notificationId);
});

browser.notifications.onClosed.addListener(notificationId => {
  const splittedNotificationId = notificationId.split('::');
  const actionType = splittedNotificationId[0];
  const uid = splittedNotificationId[1];

  if (actionType === 'vacancy') {
    store.dispatch('notificationVacancyRooms/removeNotificationByUID', uid);
  }

  browser.notifications.clear(notificationId);
});
