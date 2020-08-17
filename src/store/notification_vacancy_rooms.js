export default {
  namespaced: true,

  state: {
    // uid: create_timeとroom_nameの複合ユニーク
    // creator_midやindexはその都度変わるので使えない
    rooms: [],
  },

  getters: {
    rooms: (state) => {
      return [].concat(state.rooms);
    },
  },

  mutations: {
    // storage.localからstateを復元
    restoreFromLocalStorage(state) {
      browser.storage.local.get('notificationVacancyRooms').then(({ notificationVacancyRooms }) => {
        state.rooms = notificationVacancyRooms || [];
      });
    },

    setNotification(state, uid) {
      browser.storage.local
        .get('notificationVacancyRooms')
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
  },

  actions: {
    removeNotificationByUID({ commit }, uid) {
      commit('removeNotification', uid);
    },

    setNotificationByUID({ commit }, uid) {
      commit('setNotification', uid);
    },

    restoreFromLocalStorage({ commit }) {
      commit('restoreFromLocalStorage');
    },
  },
};
