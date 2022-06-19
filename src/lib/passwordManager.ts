import browser from 'webextension-polyfill';

export const savePassword = (roomName: string, password: string) => {
  browser.storage.local.get('v2RoomPasswords').then(({ v2RoomPasswords }) => {
    if (typeof v2RoomPasswords !== 'object' || Array.isArray(v2RoomPasswords)) {
      v2RoomPasswords = {};
    }

    v2RoomPasswords[roomName] = password;

    browser.storage.local.set({
      v2RoomPasswords,
    });
  });
};

export const getPasswordByRoomName = async (roomName: string) => {
  const res = await browser.storage.local.get('v2RoomPasswords').then(({ v2RoomPasswords }) => {
    try {
      return v2RoomPasswords[roomName] || '';
    } catch {
      return '';
    }
  });

  return res;
};

export const resetRememberPasswords = () => {
  browser.storage.local.set({
    v2RoomPasswords: {},
  });
};
