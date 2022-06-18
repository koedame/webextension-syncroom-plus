import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

type roomPasswords = {
  [key: string]: string;
};

const savedRoomPasswordsSelector = selector<roomPasswords>({
  key: 'savedRoomPasswords',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('roomPasswords').then(({ roomPasswords }) => {
      if (typeof roomPasswords === 'undefined') {
        return {};
      } else {
        return roomPasswords;
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
    browser.storage.local.set({ roomPasswords: newValue });
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
