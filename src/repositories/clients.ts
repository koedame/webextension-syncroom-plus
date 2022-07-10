import ky from 'ky';
import browser from 'webextension-polyfill';

export const srpClient = (path: string, options?: RequestInit) => {
  const url = 'https://syncroomplus.koeda.me' + path;
  const headers = new Headers();
  headers.set('X-SYNCROOM-Plus-Version', browser.runtime.getManifest().version);

  return fetch(url, {
    ...options,
    headers
  });
}

export const srClient = (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options
  });
}

export const srClientWithToken = () => {
  const srClient = ky.create({});
  return srClient.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('authorization', localStorage.getItem('token') || '');
        },
      ],
    },
  });
};
