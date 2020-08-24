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

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import Buefy from 'buefy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, fab);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

const moment = require('moment');
require('moment/locale/ja');

Vue.use(require('vue-moment'), {
  moment,
});

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

const browser = require('webextension-polyfill');

// ファビコン追加
const faviconTag: string = `<link rel="shortcut icon" href="${browser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);

import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

const manifestInfo = browser.runtime.getManifest();

Sentry.init({
  dsn: 'https://c23617d9245a48aab09dc438bb257301@o438164.ingest.sentry.io/5402400',
  release: manifestInfo.browser_action.default_title + '@' + manifestInfo.version,
  integrations: [new VueIntegration({ Vue, attachProps: true })],
  environment: process.env.NODE_ENV,
});

console.log(process.env.NODE_ENV);

/* eslint-disable no-new */
new Vue({
  el: '#wrapper',
  store: store,
  render: (h) => h(App),
});
