import axiosClient from './lib/axios';
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

  axiosClient.get('/api/v1/rooms/all').then((res) => {
    // ユーザーオンライン通知
    browser.storage.local.get('notificationOnlineMembers').then(({ notificationOnlineMembers }) => {
      // データがなければ何もしない
      if (!Array.isArray(notificationOnlineMembers)) {
        return false;
      }
      if (notificationOnlineMembers.length === 0) {
        return false;
      }

      const onlineMembers = [];
      for (const room of res.data.rooms) {
        for (const member of room.members) {
          onlineMembers.push(member);

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
            iconUrl: 'images/band.png',
            title: `${translate('room_name')}：${room.name}`,
          };

          if (member.is_owner) {
            // オーナーの場合はルームを作成のメッセージ
            options.message = translate('user_room_created', { username: notificationOnlineMember.memberName });
          } else {
            // オーナーでない場合はルームに参加のメッセージ
            options.message = translate('user_onlined', { username: notificationOnlineMember.memberName });
          }

          if (currentBrowser === 'GoogleChrome' || currentBrowser === 'Edge') {
            // ユーザーがクリックするか閉じるまで通知を閉じない設定
            // このオプションはGoogleChromeとEdgeしか対応していないので判定して追加する
            // 参考: https://developer.mozilla.org/ja/docs/Web/API/Notification/requireInteraction
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

      // 通知の取り消し
      for (const notificationOnlineMember of notificationOnlineMembers) {
        // ユーザーがオンラインでなければ通知を取り消し
        if (!onlineMembers.some((m) => m.name === notificationOnlineMember.memberName)) {
          browser.notifications.clear(`online_member::${notificationOnlineMember.memberName}`);
        }
      }
    });

    // 空き部屋通知周り
    browser.storage.local.get('notificationVacancyRooms').then(({ notificationVacancyRooms }) => {
      // データがなければ何もしない
      if (!Array.isArray(notificationVacancyRooms)) {
        return false;
      }
      if (notificationVacancyRooms.length === 0) {
        return false;
      }

      // 空き部屋通知
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
          iconUrl: 'images/band.png',
          title: `${translate('room_name')}：${room.name}`,
          message: translate('you_can_now_join'),
        };
        if (currentBrowser === 'GoogleChrome' || currentBrowser === 'Edge') {
          // ユーザーがクリックするか閉じるまで通知を閉じない設定
          // このオプションはGoogleChromeとEdgeしか対応していないので判定して追加する
          // 参考: https://developer.mozilla.org/ja/docs/Web/API/Notification/requireInteraction
          options.requireInteraction = true;
        }
        browser.notifications.create(`vacancy::${uid}`, options);

        // 通知したらキューを削除しておく
        const newNotificationVacancyRooms = notificationVacancyRooms.filter((r) => r.uid !== uid);
        browser.storage.local.set({
          notificationVacancyRooms: JSON.parse(JSON.stringify(newNotificationVacancyRooms)),
        });
      }

      // キューの掃除
      // 出っぱなしの通知を消すにはキューを残す設計に変えないといけない
      for (const notificationVacancyRoom of notificationVacancyRooms) {
        const tmp: string[] = notificationVacancyRoom.uid.split('||');
        const roomName = tmp[1];

        if (!res.data.rooms.some((r: any) => r.name === roomName)) {
          // 部屋が存在しないキューが残っていたら削除
          const newNotificationVacancyRooms = notificationVacancyRooms.filter((r) => r.uid !== notificationVacancyRoom.uid);
          browser.storage.local.set({
            notificationVacancyRooms: JSON.parse(JSON.stringify(newNotificationVacancyRooms)),
          });
        }
      }
    });
  });
}, 3000);
