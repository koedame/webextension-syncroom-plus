import Vue from 'vue';
import App from './App';
import store from '../store';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: 'main > article',
  store: store,
  render: h => h(App),
});

let faviconTag = `<link rel="shortcut icon" href="${browser.extension.getURL("/icons/favicon.ico")}">`
console.log(faviconTag)
document.head.insertAdjacentHTML('beforeend', faviconTag);
