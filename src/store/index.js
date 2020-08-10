import Vue from 'vue';
import Vuex from 'vuex';

import VuexWebExtensions from 'vuex-webextensions';

Vue.use(Vuex);

import rooms from './rooms.js'

export default new Vuex.Store({
  plugins: [VuexWebExtensions({
    // persistentStates: ['currentTabUrl'],
  })],
  // state: {
  //   currentTabUrl: '',
  // },
  modules: {
    rooms: rooms,
  },
})
