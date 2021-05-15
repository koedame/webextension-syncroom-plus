// 参考： https://webapi.syncroom.appservice.yamaha.com/ndroom/static/js/util.js
// 本家は !()_ もURIエンコード対象になっているが、 `encodeURIComponent` が対応しておらず、
// そのままでもSYNCROOMは正しく認識できているのでよしとする。
const makeJoinUri = (roomName: string, password: string, temporaly: boolean) => {
  // 入室： 2
  let mode = '2';
  if (temporaly) {
    // 仮入室： 3
    mode = '3';
  }

  // `encodeURI` だと `&` がエンコードされないので `encodeURIComponent` を使う
  const appUri = `joingroup?mode=${mode}&pid=4&nickname=&groupname=${encodeURIComponent(roomName)}&password=${encodeURIComponent(password)}`;
  const encodedAppUri = btoa(appUri);

  return 'syncroom:' + encodedAppUri;
};

export default makeJoinUri;
