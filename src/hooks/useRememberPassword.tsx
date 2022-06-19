import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

type roomPasswords = {
  [key: string]: string;
};

const savedRoomPasswordsSelector = selector<roomPasswords>({
  key: 'savedRoomPasswords',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('v2RoomPasswords').then(({ v2RoomPasswords }) => {
      if (typeof v2RoomPasswords === 'undefined') {
        return {};
      } else {
        return v2RoomPasswords;
      }
    });
    return res;
  },
});

const rememberPasswordsState = atom<roomPasswords>({
  key: 'rememberPassword',
  default: savedRoomPasswordsSelector,
});

export const rememberPasswordsSelector = selector<roomPasswords>({
  key: 'rememberPasswordsSelector',
  get: ({ get }) => get(rememberPasswordsState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ v2RoomPasswords: newValue });
    set(rememberPasswordsState, newValue);
  },
});

export const useRememberPassword = () => {
  const [rememberPasswords, setRememberPasswords] = useRecoilState(rememberPasswordsSelector);

  const getRememberPasswordsByRoomName = (roomName: string): string => {
    if (typeof rememberPasswords[roomName] === 'string') {
      return rememberPasswords[roomName];
    } else {
      return '';
    }
  };

  const saveRoomPassword = (roomName: string, password: string) => {
    let temp = { ...rememberPasswords };
    temp[roomName] = password;
    setRememberPasswords(temp);
  };

  return {
    rememberPasswords,
    setRememberPasswords,
    getRememberPasswordsByRoomName,
    saveRoomPassword,
  };
};
