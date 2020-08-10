import store from './store';
global.browser = require('webextension-polyfill');

import axios from 'axios';

setInterval(() => {
  axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4')
    .then((res) => {
      browser.browserAction.setBadgeText({
        // String型である必要があるので変換
        text: String(res.data.total_published_rooms)
      });
    })
}, 5000)
