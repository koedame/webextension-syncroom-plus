import Vue from 'vue';
import Vuex from 'vuex';

import rooms from './rooms.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    rooms: rooms,
  },
});
