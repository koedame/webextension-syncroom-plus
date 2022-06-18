import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

const savedConfigAutoReloadSelector = selector<boolean>({
  key: 'savedConfigAutoReload',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('configAutoReload').then(({ configAutoReload }) => {
      if (typeof configAutoReload !== 'undefined') {
        return configAutoReload;
      } else {
        return true;
      }
    });
    return res;
  },
});

const configAutoReloadState = atom<boolean>({
  key: 'configAutoReload',
  default: savedConfigAutoReloadSelector,
});

export const configAutoReloadSelector = selector<boolean>({
  key: 'configAutoReloadSelector',
  get: ({ get }) => get(configAutoReloadState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ configAutoReload: newValue });
    set(configAutoReloadState, newValue);
  },
});

export const useConfigAutoReload = () => {
  const [configAutoReload, setConfigAutoReload] = useRecoilState(configAutoReloadSelector);

  return {
    configAutoReload,
    setConfigAutoReload,
  };
};
