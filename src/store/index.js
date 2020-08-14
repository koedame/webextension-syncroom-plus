import Vue from 'vue';
import Vuex from 'vuex';

import clock from './clock.js';
import favoriteMembers from './favorite_members.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    clock: clock,
    favoriteMembers: favoriteMembers,
  },
});
