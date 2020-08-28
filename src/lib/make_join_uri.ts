// https://syncroom.yamaha.com/play/
// https://webapi.syncroom.appservice.yamaha.com/ndroom/static/js/util.js
const makeJoinUri = (roomName: string, pass: any, pid: number, mode: number): string => {
  let urienc = (str: string | number): string => {
    return encodeURIComponent(str).replace(/[!*'()]/g, (c) => {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  let str: string = 'joingroup?mode=' + urienc(mode) + '&pid=' + urienc(pid) + '&nickname=&groupname=' + urienc(roomName) + '&password=' + urienc(pass);
  let uri: string = 'syncroom:';
  let tbl: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let len: number = str.length;
  let mod: number = len % 3;
  if (mod > 0) len -= mod;

  let i, t;
  for (i = 0; i < len; i += 3) {
    t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += tbl.charAt((t >> 6) & 0x3f);
    uri += tbl.charAt(t & 0x3f);
  }
  if (mod === 2) {
    t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8);
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += tbl.charAt((t >> 6) & 0x3f);
    uri += '=';
  } else if (mod === 1) {
    t = str.charCodeAt(i + 0) << 16;
    uri += tbl.charAt((t >> 18) & 0x3f);
    uri += tbl.charAt((t >> 12) & 0x3f);
    uri += '=';
    uri += '=';
  }

  return uri;
};

export default makeJoinUri;
