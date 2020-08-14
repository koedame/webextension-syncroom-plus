import Vue from 'vue';
import Vuex from 'vuex';

import clock from './clock.js';
import favoriteMembers from './favorite_members.js';

import VuexPersistence from 'vuex-persist';

global.browser = require('webextension-polyfill');

const vuexLocal = new VuexPersistence({
  storage: browser.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    clock: clock,
    favoriteMembers: favoriteMembers,
  },
  plugins: [vuexLocal.plugin],
});
