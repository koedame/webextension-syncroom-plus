import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { clock } from './Clock';
import { favoriteMembers } from './FavoriteMembers';
import { notificationVacancyRooms } from './NotificationVacancyRooms';
import { notificationOnlineMembers } from './NotificationOnlineMembers';
import { config } from './Config';

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
    config,
  },
  plugins: [],
};

export default new Vuex.Store<RootState>(store);
