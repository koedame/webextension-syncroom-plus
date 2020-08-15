import Vue from 'vue';
import Vuex from 'vuex';

import clock from './clock.js';
import favoriteMembers from './favorite_members.js';

import createMutationsSharer from 'vuex-shared-mutations';

global.browser = require('webextension-polyfill');

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    clock: clock,
    favoriteMembers: favoriteMembers,
  },
  plugins: [
    // 複数Tab/Windowでのstateの共有
    createMutationsSharer({
      predicate: (mutation, state) => {
        const predicate = Object.keys(favoriteMembers.mutations).map(name => `favoriteMembers/${name}`);
        // Conditionally trigger other plugins subscription event here to
        // have them called only once (in the tab where the commit happened)
        // ie. save certain values to localStorage
        // pluginStateChanged(mutation, state)
        return predicate.indexOf(mutation.type) >= 0;
      },
    }),
  ],
});
