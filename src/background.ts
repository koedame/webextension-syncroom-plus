import axios from 'axios';
import { browser } from 'webextension-polyfill-ts';
import { i18n, translate } from './lib/i18n';

// 参考: https://qiita.com/sakuraya/items/33f93e19438d0694a91d
const userAgent: string = window.navigator.userAgent.toLowerCase();
let currentBrowser: string;
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

// エクステンションのアイコンクリック時のアクション
browser.browserAction.onClicked.addListener((): void => {
  browser.tabs.create({
    url: 'https://syncroom.yamaha.com/play/',
    active: true,
  });
});

// 通知をクリックしたとき
browser.notifications.onClicked.addListener((notificationId: string): void => {
  browser.tabs.create({
    url: 'https://syncroom.yamaha.com/play/',
    active: true,
  });

  browser.notifications.clear(notificationId);
});

// 通知を閉じたとき
browser.notifications.onClosed.addListener((notificationId: string): void => {
  browser.notifications.clear(notificationId);
});

setInterval(() => {
  browser.storage.local.get('configLanguage').then(({ configLanguage }) => {
    if (typeof configLanguage === 'undefined') {
      i18n.locale = 'ja';
    } else {
      i18n.locale = configLanguage;
    }
  });

  // FIXME: URLを変更
  axios.get('http://localhost:8080/api/v1/rooms/all').then((res) => {
    // FIXME: オフラインになったら通知を削除
    // ユーザーオンライン通知
    browser.storage.local.get('notificationOnlineMembers').then(({ notificationOnlineMembers }) => {
      // データがなければ何もしない
      if (!Array.isArray(notificationOnlineMembers)) {
        return false;
      }
      if (notificationOnlineMembers.length === 0) {
        return false;
      }

      for (const room of res.data.rooms) {
        for (const member of room.members) {
          const notificationOnlineMember = notificationOnlineMembers.find((m: any) => m.memberName === member.name);

          // 登録されているメンバーでないときは何もしない
          if (typeof notificationOnlineMember === 'undefined') {
            continue;
          }

          // すでに通知済みであれば何もしない
          if (notificationOnlineMember.lastNotificationRoomCreatedTime === room.created_at) {
            continue;
          }

          const options: any = {
            type: 'basic',
            // TODO: iconをわかりやすいものに変える
            iconUrl: 'images/icon_128.png',
            title: `${translate('room_name')}：${room.name}`,
            message: translate('online_user', { username: notificationOnlineMember.memberName }),
          };

          if (currentBrowser === 'GoogleChrome') {
            // このオプションはGoogleChromeしか対応していないので判定して追加する
            // 参考: https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/notifications/NotificationOptions
            options.requireInteraction = true;
          }
          browser.notifications.create(`online_member::${notificationOnlineMember.memberName}`, options);

          // 最終通知を更新
          notificationOnlineMember.lastNotificationRoomCreatedTime = room.created_at;
          browser.storage.local.set({
            notificationOnlineMembers: JSON.parse(JSON.stringify(notificationOnlineMembers)),
          });
        }
      }
    });

    // TODO: 部屋がなくなれば通知を削除
    browser.storage.local.get('notificationVacancyRooms').then(({ notificationVacancyRooms }) => {
      // データがなければ何もしない
      if (!Array.isArray(notificationVacancyRooms)) {
        return false;
      }
      if (notificationVacancyRooms.length === 0) {
        return false;
      }

      for (const room of res.data.rooms) {
        // 満室の部屋はスキップ
        if (room.members.length === 5) {
          continue;
        }

        const uid: string = `${room.created_at}||${room.name}`;
        // 通知登録に存在しなければスキップ
        if (!notificationVacancyRooms.some((r: any) => r.uid === uid)) {
          continue;
        }

        const options: any = {
          type: 'basic',
          // TODO: iconをわかりやすいものに変える
          iconUrl: 'images/icon_128.png',
          title: `${translate('room_name')}：${room.name}`,
          message: translate('you_can_now_join'),
        };
        if (currentBrowser === 'GoogleChrome') {
          // このオプションはGoogleChromeしか対応していないので判定して追加する
          // 参考: https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/notifications/NotificationOptions
          options.requireInteraction = true;
        }
        browser.notifications.create(`vacancy::${uid}`, options);

        // 通知したらキューを削除しておく
        const newNotificationVacancyRooms = notificationVacancyRooms.filter((r) => r.uid !== uid);
        browser.storage.local.set({
          notificationVacancyRooms: JSON.parse(JSON.stringify(newNotificationVacancyRooms)),
        });
      }
    });
  });
}, 3000);
