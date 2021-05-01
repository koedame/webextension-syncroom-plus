import { browser } from 'webextension-polyfill-ts';
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
      // @ts-ignore
      .then(({ notificationVacancyRooms }) => {
        if (Array.isArray(notificationVacancyRooms)) {
          // データ形式がおかしい場合があるので整形
          const rooms: NotificationVacancyRoom[] = [];

          for (const notificationVacancyRoom of notificationVacancyRooms) {
            if (typeof notificationVacancyRoom.uid === 'undefined') {
              continue;
            }

            const room: NotificationVacancyRoom = { uid: notificationVacancyRoom.uid, createdAt: '' };

            if (typeof notificationVacancyRoom.createdAt === 'undefined') {
              room.createdAt = new Date().toISOString();
            } else {
              room.createdAt = new Date(notificationVacancyRoom.createdAt).toISOString();
            }

            rooms.push(room);
          }

          state.rooms = rooms;
        } else {
          // データがないときはエラーが起こるので初期化だけ
          state.rooms = [];
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
      // @ts-ignore
      .then(({ notificationVacancyRooms }) => {
        if (!Array.isArray(notificationVacancyRooms)) {
          // データがないときはエラーが起こるのでまずは初期化
          state.rooms = [];
        }

        if (!state.rooms.find((room) => room.uid === uid)) {
          state.rooms.push({
            uid,
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
      // @ts-ignore
      .then(({ notificationVacancyRooms }) => {
        if (Array.isArray(notificationVacancyRooms)) {
          state.rooms = state.rooms.filter((room) => room.uid !== uid);
        } else {
          // データがないときはエラーが起こるので初期化だけ
          state.rooms = [];
        }
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
