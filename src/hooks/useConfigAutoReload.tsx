import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

const savedConfigAutoReloadSelector = selector<boolean>({
  key: 'savedConfigAutoReload',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('v2ConfigAutoReload').then(({ v2ConfigAutoReload }) => {
      if (typeof v2ConfigAutoReload !== 'undefined') {
        return v2ConfigAutoReload;
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
    browser.storage.local.set({ v2ConfigAutoReload: newValue });
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
