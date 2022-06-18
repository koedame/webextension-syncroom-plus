import ky from 'ky';
import browser from 'webextension-polyfill';

export const srpClient = ky.create({
  prefixUrl: 'https://syncroomplus.koeda.me/',
  headers: {
    'X-SYNCROOM-Plus-Version': browser.runtime.getManifest().version,
  },
});

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
