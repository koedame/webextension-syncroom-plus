const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { NotificationVacancyRoomsState, RootState } from '../types';

const state: NotificationVacancyRoomsState = {
  rooms: [],
};

const getters: GetterTree<NotificationVacancyRoomsState, RootState> = {
  rooms: (state) => {
    return state.rooms;
  },
};

const mutations: MutationTree<NotificationVacancyRoomsState> = {
  // storage.localからstateを復元
  restoreFromLocalStorage(state) {
    //@ts-ignore
    browser.storage.local.get('notificationVacancyRooms').then(({ notificationVacancyRooms }) => {
      state.rooms = notificationVacancyRooms || [];
    });
  },

  setNotification(state, uid) {
    browser.storage.local
      .get('notificationVacancyRooms')
      //@ts-ignore
      .then(({ notificationVacancyRooms }) => {
        state.rooms = notificationVacancyRooms || [];
      })
      .then(() => {
        if (!state.rooms.find((room) => room.uid === uid)) {
          state.rooms.push({
            uid: uid,
            createdAt: new Date(),
          });
        }
      })
      .then(() => {
        browser.storage.local.set({
          notificationVacancyRooms: JSON.parse(JSON.stringify(state.rooms)),
        });
      });
  },

  removeNotification(state, uid) {
    browser.storage.local
      .get('notificationVacancyRooms')
      //@ts-ignore
      .then(({ notificationVacancyRooms }) => {
        state.rooms = notificationVacancyRooms || [];
      })
      .then(() => {
        state.rooms = state.rooms.filter((room) => room.uid !== uid);
      })
      .then(() => {
        browser.storage.local.set({
          notificationVacancyRooms: JSON.parse(JSON.stringify(state.rooms)),
        });
      });
  },
};

const actions: ActionTree<NotificationVacancyRoomsState, RootState> = {
  removeNotificationByUID({ commit }, uid) {
    commit('removeNotification', uid);
  },

  setNotificationByUID({ commit }, uid) {
    commit('setNotification', uid);
  },

  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const notificationVacancyRooms: Module<NotificationVacancyRoomsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
