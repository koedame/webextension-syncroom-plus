import browser from 'webextension-polyfill';
import { i18n } from '../../lib/i18n';

import { RoomRepository } from '../../repositories/roomRepository';
// import type { messageRequestType } from "../../types"

// 参考: https://qiita.com/sakuraya/items/33f93e19438d0694a91d
const userAgent: string = self.navigator.userAgent.toLowerCase();
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
browser.action.onClicked.addListener((): void => {
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

browser.alarms.create({ periodInMinutes: (1 / 60) * 5 });
browser.alarms.onAlarm.addListener(async () => {
  try {
    // TODO: 型を設定
    browser.storage.local.get('v2ConfigLanguage').then(({ v2ConfigLanguage }) => {
      if (typeof v2ConfigLanguage === 'undefined') {
        i18n.changeLanguage('ja');
      } else {
        i18n.changeLanguage(v2ConfigLanguage);
      }
    });

    const roomlist = await RoomRepository.unauthedList();

    // ユーザーオンライン通知
    // TODO: 型を設定
    browser.storage.local.get('v2NotificationOnlineMemberIds').then(({ v2NotificationOnlineMemberIds }) => {
      // データがなければ何もしない
      if (!Array.isArray(v2NotificationOnlineMemberIds)) {
        return false;
      }
      if (v2NotificationOnlineMemberIds.length === 0) {
        return false;
      }

      const onlineMembers = [];
      for (const room of roomlist.rooms) {
        for (const member of room.members) {
          onlineMembers.push(member);

          const notificationOnlineMember = v2NotificationOnlineMemberIds.find((m) => m.userId === member.userId);

          // 登録されているメンバーでないときは何もしない
          if (typeof notificationOnlineMember === 'undefined') {
            continue;
          }

          // すでに通知済みであれば何もしない
          if (notificationOnlineMember.lastNotificationRoomCreatedTime === room.createTime) {
            continue;
          }

          const options: any = {
            type: 'basic',
            iconUrl: 'images/band.png',
            title: `${i18n.t('room_name')}：${room.roomName}`,
          };

          options.message = i18n.t('user_onlined', { username: member.nickname });

          if (currentBrowser === 'GoogleChrome' || currentBrowser === 'Edge') {
            // ユーザーがクリックするか閉じるまで通知を閉じない設定
            // このオプションはGoogleChromeとEdgeしか対応していないので判定して追加する
            // 参考: https://developer.mozilla.org/ja/docs/Web/API/Notification/requireInteraction
            options.requireInteraction = true;
          }
          browser.notifications.create(`online_member::${notificationOnlineMember.memberName}`, options);

          // 最終通知を更新
          notificationOnlineMember.lastNotificationRoomCreatedTime = room.createTime;
          browser.storage.local.set({
            v2NotificationOnlineMemberIds: JSON.parse(JSON.stringify(v2NotificationOnlineMemberIds)),
          });
        }
      }

      // 通知の取り消し
      for (const notificationOnlineMemberId of v2NotificationOnlineMemberIds) {
        // ユーザーがオンラインでなくなったら通知を取り消し
        if (!onlineMembers.some((m) => m.userId === notificationOnlineMemberId.userId)) {
          browser.notifications.clear(`online_member::${notificationOnlineMemberId.userId}`);
        }
      }
    });

    // 空き部屋通知周り
    // TODO: 型を設定
    browser.storage.local.get('v2NotificationVacancyRooms').then(({ v2NotificationVacancyRooms }) => {
      // データがなければ何もしない
      if (!Array.isArray(v2NotificationVacancyRooms)) {
        return false;
      }
      if (v2NotificationVacancyRooms.length === 0) {
        return false;
      }

      // 空き部屋通知
      for (const room of roomlist.rooms) {
        // 満室の部屋はスキップ
        if (room.members.length === 5) {
          continue;
        }

        const uid: string = `${room.createTime}||${room.roomName}`;
        // 通知登録に存在しなければスキップ
        if (!v2NotificationVacancyRooms.some((r) => r.uid === uid)) {
          continue;
        }

        const options: any = {
          type: 'basic',
          iconUrl: 'images/band.png',
          title: `${i18n.t('room_name')}：${room.roomName}`,
          message: i18n.t('you_can_now_join'),
        };
        if (currentBrowser === 'GoogleChrome' || currentBrowser === 'Edge') {
          // ユーザーがクリックするか閉じるまで通知を閉じない設定
          // このオプションはGoogleChromeとEdgeしか対応していないので判定して追加する
          // 参考: https://developer.mozilla.org/ja/docs/Web/API/Notification/requireInteraction
          options.requireInteraction = true;
        }
        browser.notifications.create(`vacancy::${uid}`, options);

        // 通知したらキューを削除しておく
        const newNotificationVacancyRooms = v2NotificationVacancyRooms.filter((r) => r.uid !== uid);
        browser.storage.local.set({
          v2NotificationVacancyRooms: JSON.parse(JSON.stringify(newNotificationVacancyRooms)),
        });
      }

      // キューの掃除
      // 出っぱなしの通知を消すにはキューを残す設計に変えないといけない
      for (const notificationVacancyRoom of v2NotificationVacancyRooms) {
        const tmp: string[] = notificationVacancyRoom.uid.split('||');
        const roomName = tmp[1];

        if (!roomlist.rooms.some((r) => r.roomName === roomName)) {
          // 部屋が存在しないキューが残っていたら削除
          const newNotificationVacancyRooms = v2NotificationVacancyRooms.filter((r) => r.uid !== notificationVacancyRoom.uid);
          browser.storage.local.set({
            v2NotificationVacancyRooms: JSON.parse(JSON.stringify(newNotificationVacancyRooms)),
          });
        }
      }
    });
  } catch (error) {
    // エラーで停止しないようにキャッチして握りつぶしておく
    console.error(error);
  }
});
