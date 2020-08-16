import Vue from 'vue';
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

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

// stateを復元
store.dispatch('favoriteMembers/restoreFromLocalStorage');
store.dispatch('notificationVacancyRooms/restoreFromLocalStorage');

/* eslint-disable no-new */
new Vue({
  el: 'main > article',
  store: store,
  render: h => h(App),
});

// ファビコン追加
const faviconTag = `<link rel="shortcut icon" href="${browser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);
