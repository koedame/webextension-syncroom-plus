import Vue from 'vue';
import App from './App';
import store from '../store';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

Vue.use(require('vue-moment'));

/* eslint-disable no-new */
new Vue({
  el: 'main > article',
  store,
  render: h => h(App),
});
