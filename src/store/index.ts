import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { clock } from './Clock';
import { favoriteMembers } from './FavoriteMembers';
import { notificationVacancyRooms } from './NotificationVacancyRooms';
import { notificationOnlineMembers } from './NotificationOnlineMembers';

//@ts-ignore
import createMutationsSharer from 'vuex-shared-mutations';

Vue.use(Vuex);

import { RootState } from './types';

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    clock,
    favoriteMembers,
    notificationVacancyRooms,
    notificationOnlineMembers,
  },
  plugins: [
    // 複数Tab/Windowでのstateの共有
    createMutationsSharer({
      predicate: (mutation: any) => {
        const predicate: Array<string> = []
          .concat(Object.keys(favoriteMembers.mutations).map((name) => `favoriteMembers/${name}`))
          .concat(Object.keys(notificationVacancyRooms.mutations).map((name) => `notificationVacancyRooms/${name}`))
          .concat(Object.keys(notificationOnlineMembers.mutations).map((name) => `notificationOnlineMembers/${name}`));
        // Conditionally trigger other plugins subscription event here to
        // have them called only once (in the tab where the commit happened)
        // ie. save certain values to localStorage
        // pluginStateChanged(mutation, state)
        return predicate.indexOf(mutation.type) >= 0;
      },
    }),
  ],
};

export default new Vuex.Store<RootState>(store);
