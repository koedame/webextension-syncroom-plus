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

export const srClient = ky.create({});

export const srClientWithToken = () => {
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
