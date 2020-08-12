global.browser = require('webextension-polyfill');

browser.browserAction.onClicked.addListener(function() {
  browser.tabs.create({
    url: 'https://syncroom.yamaha.com/play/',
    active: true,
  });
});
