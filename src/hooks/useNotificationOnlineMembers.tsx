import { atom, selector, useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';
import { SYNCROOM } from '../types/syncroom';

export type NotificationOnlineMemberType = {
  userId: SYNCROOM.UserIdType;
  createdAt: string;
  lastNotificationRoomCreatedTime: string;
};

const savedNotificationOnlineMemberIdsSelector = selector<NotificationOnlineMemberType[]>({
  key: 'savedNotificationOnlineMemberIds',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('v2NotificationOnlineMemberIds').then(({ v2NotificationOnlineMemberIds }) => {
      if (typeof v2NotificationOnlineMemberIds !== 'undefined') {
        return v2NotificationOnlineMemberIds;
      } else {
        return [] as NotificationOnlineMemberType[];
      }
    });
    return res;
  },
});

const notificationOnlineMemberIdsState = atom<NotificationOnlineMemberType[]>({
  key: 'notificationOnlineMemberIds',
  default: savedNotificationOnlineMemberIdsSelector,
});

export const notificationOnlineMemberIdsSelector = selector<NotificationOnlineMemberType[]>({
  key: 'notificationOnlineMemberIdsSelector',
  get: ({ get }) => get(notificationOnlineMemberIdsState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ v2NotificationOnlineMemberIds: newValue });
    set(notificationOnlineMemberIdsState, newValue);
  },
});

export const useNotificationOnlineMemberIds = () => {
  const [notificationOnlineMemberIds, setNotificationOnlineMemberIds] = useRecoilState(notificationOnlineMemberIdsSelector);
  const reloadNotificationOnlineMemberIds = useRecoilRefresher_UNSTABLE(notificationOnlineMemberIdsSelector);
  const removeNotificationOnlineMemberFromUserId = async (userId: SYNCROOM.UserIdType) => {
    const newValue = notificationOnlineMemberIds.filter((m) => {
      return m.userId !== userId;
    });

    setNotificationOnlineMemberIds(newValue);
  };

  const addNotificationOnlineMemberFromName = (userId: SYNCROOM.UserIdType, roomCreatedAt: string) => {
    const newValue = [
      ...notificationOnlineMemberIds,
      {
        userId,
        createdAt: new Date().toISOString(),
        lastNotificationRoomCreatedTime: roomCreatedAt,
      },
    ];
    setNotificationOnlineMemberIds(newValue);
  };

  const isNotificationOnlineMember = (userId: SYNCROOM.UserIdType): boolean => {
    for (let member of notificationOnlineMemberIds) {
      if (member.userId === userId) {
        return true;
      }
    }
    return false;
  };

  return {
    reloadNotificationOnlineMemberIds,
    notificationOnlineMemberIds,
    setNotificationOnlineMemberIds,
    isNotificationOnlineMember,
    removeNotificationOnlineMemberFromUserId,
    addNotificationOnlineMemberFromName,
  };
};
