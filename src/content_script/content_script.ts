const browser = require('webextension-polyfill');

// 不要になるscriptとiframeを削除
const scriptTags: NodeList = window.document.querySelectorAll('script,iframe,style,link[rel="stylesheet"]');
scriptTags.forEach((value: Node, key: number, parent: NodeList): void => {
  value.parentNode.removeChild(value);
});

// 参考: https://qiita.com/sakuraya/items/33f93e19438d0694a91d
const userAgent: string = window.navigator.userAgent.toLowerCase();
let currentBrowser: string;
if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
  currentBrowser = 'InternetExplorer';
} else if (userAgent.indexOf('edge') !== -1) {
  currentBrowser = 'Edge';
} else if (userAgent.indexOf('chrome') !== -1) {
  currentBrowser = 'GoogleChrome';
} else if (userAgent.indexOf('safari') !== -1) {
  currentBrowser = 'Safari';
} else if (userAgent.indexOf('firefox') !== -1) {
  currentBrowser = 'FireFox';
} else if (userAgent.indexOf('opera') !== -1) {
  currentBrowser = 'Opera';
} else {
  currentBrowser = 'unknown';
}

import Vue from 'vue';
// @ts-ignore
import App from './App';
import store from '../store';

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import Buefy from 'buefy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

const moment = require('moment');
require('moment/min/locales.min');

Vue.use(require('vue-moment'), {
  moment,
});

import { i18n } from '../lib/i18n';

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');
store.dispatch('config/restoreFromLocalStorage');

// background.ts側で更新されたデータは反映されないので定期的に読み込みを行う
setInterval((): void => {
  store.dispatch('favoriteMembers/restoreFromLocalStorage');
  store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
  store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');
  store.dispatch('config/restoreFromLocalStorage');
}, 1000);

// ファビコン追加
const faviconTag: string = `<link rel="shortcut icon" href="${browser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);

new Vue({
  el: '#wrapper',
  store,
  // @ts-ignore
  i18n,
  render: (h) => h(App),
});
