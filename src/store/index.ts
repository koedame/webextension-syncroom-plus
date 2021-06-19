/* eslint-disable import/first */
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { favoriteMembers } from './FavoriteMembers';
import { notificationVacancyRooms } from './NotificationVacancyRooms';
import { notificationOnlineMembers } from './NotificationOnlineMembers';
import { config } from './Config';
import { ignoreAds } from './IgnoreAds';

Vue.use(Vuex);

import { RootState } from './types';

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    favoriteMembers,
    notificationVacancyRooms,
    notificationOnlineMembers,
    config,
    ignoreAds,
  },
  plugins: [],
};

export default new Vuex.Store<RootState>(store);
