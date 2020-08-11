import Vue from 'vue';
import App from './App';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: 'main > article',
  render: h => h(App),
});
