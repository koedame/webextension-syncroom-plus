import browser from 'webextension-polyfill';

export const srpClient = (path: string, options?: RequestInit): Promise<Response> => {
  const url = 'https://syncroomplus.koeda.me' + path;
  const headers = new Headers();
  headers.set('X-SYNCROOM-Plus-Version', browser.runtime.getManifest().version);

  return new Promise((resolve, reject) => {
    fetch(url, {
      ...options,
      headers,
    })
      .then((res) => {
        if (!res.ok) {
          // fetch は 2xx 以外でもエラーにならないので、自前でエラー扱いにする
          reject(res);
        } else {
          resolve(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const srClient = (url: string, options?: RequestInit): Promise<Response> => {
  return new Promise(async (resolve, reject) => {
    await fetch(url, {
      ...options,
    })
      .then((res) => {
        if (!res.ok) {
          // fetch は 2xx 以外でもエラーにならないので、自前でエラー扱いにする
          reject(res);
        } else {
          resolve(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
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
