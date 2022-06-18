import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

const savedConfigRememberPasswordSelector = selector<boolean>({
  key: 'savedConfigRememberPassword',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('configRememberPassword').then(({ configRememberPassword }) => {
      if (typeof configRememberPassword !== 'undefined') {
        return configRememberPassword;
      } else {
        return true;
      }
    });
    return res;
  },
});

const configRememberPasswordState = atom<boolean>({
  key: 'configRememberPassword',
  default: savedConfigRememberPasswordSelector,
});

export const configRememberPasswordSelector = selector<boolean>({
  key: 'configRememberPasswordSelector',
  get: ({ get }) => get(configRememberPasswordState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ configRememberPassword: newValue });
    set(configRememberPasswordState, newValue);
  },
});

export const useConfigRememberPassword = () => {
  const [configRememberPassword, setConfigRememberPassword] = useRecoilState(configRememberPasswordSelector);

  return {
    configRememberPassword,
    setConfigRememberPassword,
  };
};
