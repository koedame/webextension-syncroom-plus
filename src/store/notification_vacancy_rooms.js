export default {
  namespaced: true,

  state: {
    // uid: create_timeとroom_nameの複合ユニーク
    // creator_midやindexはその都度変わるので使えない
    rooms: [],
  },

  getters: {
    rooms: state => {
      return [].concat(state.rooms);
    },
  },

  mutations: {
    // storage.localからstateを復元
    restoreFromLocalStorage(state) {
      browser.storage.local.get('notificationVacancyRooms').then(({ notificationVacancyRooms }) => {
        Object.assign(state.rooms, notificationVacancyRooms || []);
      });
    },

    // storage.localにstateを保存
    dumpToLocalStorage(state) {
      browser.storage.local.set({
        notificationVacancyRooms: JSON.parse(JSON.stringify(state.rooms)),
      });
    },

    setNotification(state, uid) {
      if (!state.rooms.find(room => room.uid === uid)) {
        state.rooms.push({
          uid: uid,
          createdAt: new Date(),
        });
      }
    },

    removeNotification(state, uid) {
      state.rooms = state.rooms.filter(room => room.uid !== uid);
    },
  },

  actions: {
    removeNotificationByUID({ commit, state }, uid) {
      commit('removeNotification', uid);
      commit('dumpToLocalStorage');
    },

    setNotificationByUID({ commit, state }, uid) {
      commit('setNotification', uid);
      commit('dumpToLocalStorage');
    },

    restoreFromLocalStorage({ commit }) {
      commit('restoreFromLocalStorage');
    },
  },
};
