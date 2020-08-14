import Vue from 'vue';
import Vuex from 'vuex';

import clock from './clock.js';
import favoriteMembers from './favorite_members.js';

import VuexPersistence from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations';

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
  plugins: [
    // stateをlocalStrageに保存して永続化
    vuexLocal.plugin,
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
