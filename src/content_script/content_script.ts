/* eslint-disable import/first */
// 不要になるscriptとiframeを削除
const scriptTags: NodeList = window.document.querySelectorAll('script,iframe,style,link[rel="stylesheet"]');
scriptTags.forEach((value: Node, key: number, parent: NodeList): void => {
  value.parentNode.removeChild(value);
});

import Vue from 'vue';
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

Vue.use(require('vue-moment'));

import { i18n } from '../lib/i18n';

/* eslint-disable no-new */
new Vue({
  el: '#wrapper',
  store,
  i18n,
  render: (h) => h(App),
});

// ファビコン追加
const faviconTag: string = '<link rel="shortcut icon" href="https://syncroomplus.koeda.me/favicon.ico">';
document.head.insertAdjacentHTML('beforeend', faviconTag);

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');
store.dispatch('config/restoreFromLocalStorage');

// background.ts側で更新されたデータは反映されないので定期的に読み込みを行う
setInterval((): void => {
  store.dispatch('ignoreAds/restoreFromLocalStorage');
  store.dispatch('favoriteMembers/restoreFromLocalStorage');
  store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');
  store.dispatch('notificationOnlineMembers/restoreFromLocalStorage');
  store.dispatch('config/restoreFromLocalStorage');
}, 1000);
