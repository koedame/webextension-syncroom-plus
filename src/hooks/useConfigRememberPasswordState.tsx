import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

const savedConfigRememberPasswordSelector = selector<boolean>({
  key: 'savedConfigRememberPassword',
  get: async ({}) => {
    const res = await browser.storage.local.get('v2ConfigRememberPassword').then(({ v2ConfigRememberPassword }) => {
      if (typeof v2ConfigRememberPassword !== 'undefined') {
        return v2ConfigRememberPassword;
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
    browser.storage.local.set({ v2ConfigRememberPassword: newValue });
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
