const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { NotificationVacancyRoomsState, NotificationVacancyRoom, RootState } from '../types';

const state: NotificationVacancyRoomsState = {
  rooms: [],
};

const getters: GetterTree<NotificationVacancyRoomsState, RootState> = {
  rooms: (state) => {
    return [].concat(state.rooms);
  },
};

const mutations: MutationTree<NotificationVacancyRoomsState> = {
  restoreFromLocalStorage(state) {
    browser.storage.local
      .get('notificationVacancyRooms')
      //@ts-ignore
      .then(({ notificationVacancyRooms }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof notificationVacancyRooms === 'undefined') {
          state.rooms = [];
        } else {
          if (Array.isArray(notificationVacancyRooms)) {
            let rooms: Array<NotificationVacancyRoom> = [];

            for (let notificationVacancyRoom of notificationVacancyRooms) {
              if (typeof notificationVacancyRoom.uid === 'undefined') {
                continue;
              }

              let member: NotificationVacancyRoom = { uid: notificationVacancyRoom.uid, createdAt: '' };

              if (typeof notificationVacancyRoom.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationVacancyRoom.createdAt).toISOString();
              }

              rooms.push(member);
            }

            state.rooms = rooms;
          } else {
            state.rooms = [];
          }
        }
      })
      .then(() => {
        browser.storage.local.set({
          notificationVacancyRooms: JSON.parse(JSON.stringify(state.rooms)),
        });
      });
  },

  setNotification(state, uid) {
    browser.storage.local
      .get('notificationVacancyRooms')
      //@ts-ignore
      .then(({ notificationVacancyRooms }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof notificationVacancyRooms === 'undefined') {
          state.rooms = [];
        } else {
          if (Array.isArray(notificationVacancyRooms)) {
            let rooms: Array<NotificationVacancyRoom> = [];

            for (let notificationVacancyRoom of notificationVacancyRooms) {
              if (typeof notificationVacancyRoom.uid === 'undefined') {
                continue;
              }

              let member: NotificationVacancyRoom = { uid: notificationVacancyRoom.uid, createdAt: '' };

              if (typeof notificationVacancyRoom.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationVacancyRoom.createdAt).toISOString();
              }

              rooms.push(member);
            }

            state.rooms = rooms;
          } else {
            state.rooms = [];
          }
        }
      })
      .then(() => {
        if (!state.rooms.find((room) => room.uid === uid)) {
          state.rooms.push({
            uid: uid,
            createdAt: new Date().toISOString(),
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
        // データがないときはエラーが起こるので初期化
        if (typeof notificationVacancyRooms === 'undefined') {
          state.rooms = [];
        } else {
          if (Array.isArray(notificationVacancyRooms)) {
            let rooms: Array<NotificationVacancyRoom> = [];

            for (let notificationVacancyRoom of notificationVacancyRooms) {
              if (typeof notificationVacancyRoom.uid === 'undefined') {
                continue;
              }

              let member: NotificationVacancyRoom = { uid: notificationVacancyRoom.uid, createdAt: '' };

              if (typeof notificationVacancyRoom.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationVacancyRoom.createdAt).toISOString();
              }

              rooms.push(member);
            }

            state.rooms = rooms;
          } else {
            state.rooms = [];
          }
        }
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
