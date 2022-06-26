export const openInSyncroomApp = (roomName: string, password: string, temporary: boolean) => {
  window.location.href = generateUrl(roomName, password, temporary);
};

// 参考： https://webapi.syncroom.appservice.yamaha.com/ndroom/static/js/util.js
// 本家は !()_ もURIエンコード対象になっているが、 `encodeURIComponent` が対応しておらず、
// そのままでもSYNCROOMは正しく認識できているのでよしとする。
export const generateUrl = (roomName: string, password: string, temporary: boolean) => {
  // 入室： 2, 仮入室： 3
  const mode = temporary ? '3' : '2';

  // `encodeURI` だと `&` がエンコードされないので `encodeURIComponent` を使う
  const appUri = `joingroup?mode=${mode}&pid=4&nickname=&groupname=${encodeURIComponent(roomName)}&password=${encodeURIComponent(password)}`;
  const encodedAppUri = btoa(appUri);

  return 'syncroom:' + encodedAppUri;
};
