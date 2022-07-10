import browser from 'webextension-polyfill';

export const srpClient = (path: string, options?: RequestInit) => {
  const url = 'https://syncroomplus.koeda.me' + path;
  const headers = new Headers();
  headers.set('X-SYNCROOM-Plus-Version', browser.runtime.getManifest().version);

  return fetch(url, {
    ...options,
    headers,
  });
};

export const srClient = (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
  });
};

export const srClientWithToken = (url: string, options?: RequestInit) => {
  const headers = new Headers();
  headers.set('authorization', localStorage.getItem('token') || '');
  return srClient(url, {
    ...options,
    headers,
  });
};
