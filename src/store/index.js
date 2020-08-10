import Vue from 'vue';
import Vuex from 'vuex';

import VuexWebExtensions from 'vuex-webextensions';

import rooms from './rooms.js';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    VuexWebExtensions({
      // persistentStates: ['currentTabUrl'],
    }),
  ],
  // state: {
  //   currentTabUrl: '',
  // },
  modules: {
    rooms: rooms,
  },
});
