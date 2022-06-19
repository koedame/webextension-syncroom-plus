import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

export type NotificationVacancyRoom = {
  uid: string;
  createdAt: string;
};

const savedFavoriteMembersSelector = selector<NotificationVacancyRoom[]>({
  key: 'savedNotificationVacancyRooms',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('v2NotificationVacancyRooms').then(({ v2NotificationVacancyRooms }) => {
      if (typeof v2NotificationVacancyRooms !== 'undefined') {
        return v2NotificationVacancyRooms;
      } else {
        return [] as NotificationVacancyRoom[];
      }
    });
    return res;
  },
});

const notificationVacancyRoomsState = atom<NotificationVacancyRoom[]>({
  key: 'notificationVacancyRooms',
  default: savedFavoriteMembersSelector,
});

export const notificationVacancyRoomsSelector = selector<NotificationVacancyRoom[]>({
  key: 'notificationVacancyRoomsSelector',
  get: ({ get }) => get(notificationVacancyRoomsState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ v2NotificationVacancyRooms: newValue });
    set(notificationVacancyRoomsState, newValue);
  },
});

export const useNotificationVacancyRooms = () => {
  const [notificationVacancyRooms, setNotificationVacancyRooms] = useRecoilState(notificationVacancyRoomsSelector);

  const removeNotificationVacancyRooms = (uid: string) => {
    const newValue = notificationVacancyRooms.filter((m: NotificationVacancyRoom) => {
      return m.uid !== uid;
    });

    setNotificationVacancyRooms(newValue);
  };

  const addNotificationVacancyRooms = (uid: string) => {
    const newValue = [
      ...notificationVacancyRooms,
      {
        uid: uid,
        createdAt: new Date().toISOString(),
      },
    ];
    setNotificationVacancyRooms(newValue);
  };

  const isNotificationVacancyRoom = (uid: string): boolean => {
    for (let notificationVacancyRoom of notificationVacancyRooms) {
      if (notificationVacancyRoom.uid === uid) {
        return true;
      }
    }
    return false;
  };

  return {
    notificationVacancyRooms,
    setNotificationVacancyRooms,
    addNotificationVacancyRooms,
    removeNotificationVacancyRooms,
    isNotificationVacancyRoom,
  };
};
