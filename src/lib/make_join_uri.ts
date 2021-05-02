// 参考： https://webapi.syncroom.appservice.yamaha.com/ndroom/static/js/util.js
const makeJoinUri = (roomName: string, password: string, temporaly: boolean) => {
  // 入室： 2
  let mode = '2';
  if (temporaly) {
    // 仮入室： 3
    mode = '3';
  }

  const appUri = `joingroup?mode=${mode}&pid=4&nickname=&groupname=${encodeURI(roomName)}&password=${encodeURI(password)}`;
  const encodedAppUri = btoa(appUri);

  return 'syncroom:' + encodedAppUri;
};

export default makeJoinUri;
