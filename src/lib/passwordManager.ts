import browser from 'webextension-polyfill';

export const savePassword = (roomName: string, password: string) => {
  browser.storage.local.get('roomPasswords').then(({ roomPasswords }) => {
    if (typeof roomPasswords !== 'object' || Array.isArray(roomPasswords)) {
      roomPasswords = {};
    }

    roomPasswords[roomName] = password;

    browser.storage.local.set({
      roomPasswords: roomPasswords,
    });
  });
};

export const getPasswordByRoomName = async (roomName: string) => {
  const res = await browser.storage.local.get('roomPasswords').then(({ roomPasswords }) => {
    try {
      return roomPasswords[roomName] || '';
    } catch {
      return '';
    }
  });

  return res;
};

export const resetRememberPasswords = () => {
  browser.storage.local.set({
    roomPasswords: {},
  });
};
