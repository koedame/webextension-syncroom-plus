/* eslint-disable import/first */
// 不要になるscriptとiframeを削除
const scriptTags: NodeList = window.document.querySelectorAll('script,iframe,style,link[rel="stylesheet"]');
scriptTags.forEach((value: Node, key: number, parent: NodeList): void => {
  value.parentNode.removeChild(value);
});

import Vue from 'vue';
//@ts-ignore
import App from './App';
import store from '../store';

// FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas, far, fab);
Vue.component('fa', FontAwesomeIcon);

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import Buefy from 'buefy';
Vue.use(Buefy);

const browser = require('webextension-polyfill');

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');

// background.ts側で更新されたデータは反映されないので定期的に読み込みを行う
setInterval((): void => {
  store.dispatch('favoriteMembers/restoreFromLocalStorage');
  store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
  store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');
}, 1000);

/* eslint-disable no-new */
new Vue({
  el: 'body',
  store: store,
  render: (h) => h(App),
});

// ファビコン追加
const faviconTag: string = `<link rel="shortcut icon" href="${browser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);
