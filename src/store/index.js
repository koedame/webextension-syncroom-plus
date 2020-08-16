import Vue from 'vue';
import Vuex from 'vuex';

import clock from './clock.js';
import favoriteMembers from './favorite_members.js';
import notificationVacancyRooms from './notification_vacancy_rooms.js';

import createMutationsSharer from 'vuex-shared-mutations';

global.browser = require('webextension-polyfill');

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    clock: clock,
    favoriteMembers: favoriteMembers,
    notificationVacancyRooms: notificationVacancyRooms,
  },
  plugins: [
    // 複数Tab/Windowでのstateの共有
    createMutationsSharer({
      predicate: (mutation, state) => {
        const predicate = []
          .concat(Object.keys(favoriteMembers.mutations).map(name => `favoriteMembers/${name}`))
          .concat(Object.keys(notificationVacancyRooms.mutations).map(name => `notificationVacancyRooms/${name}`));
        // Conditionally trigger other plugins subscription event here to
        // have them called only once (in the tab where the commit happened)
        // ie. save certain values to localStorage
        // pluginStateChanged(mutation, state)
        return predicate.indexOf(mutation.type) >= 0;
      },
    }),
  ],
});
