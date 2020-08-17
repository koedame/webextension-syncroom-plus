export default {
  namespaced: true,

  state: {
    members: [],
  },

  mutations: {
    // storage.localからstateを復元
    restoreFromLocalStorage(state) {
      browser.storage.local.get('favoriteMembers').then(({ favoriteMembers }) => {
        Object.assign(state.members, favoriteMembers || []);
      });
    },

    // storage.localにstateを保存
    dumpToLocalStorage(state) {
      browser.storage.local.set({
        favoriteMembers: JSON.parse(JSON.stringify(state.members)),
      });
    },

    setFavorite(state, memberName) {
      if (!state.members.some((member) => member.memberName === memberName)) {
        state.members.push({
          memberName: memberName,
          favoritedAt: new Date(),
        });
      }
    },
    removeFavorite(state, memberName) {
      state.members = state.members.filter((member) => member.memberName !== memberName);
    },
  },

  actions: {
    toggleFavorite({ commit, state }, memberName) {
      if (state.members.some((member) => member.memberName === memberName)) {
        commit('removeFavorite', memberName);
      } else {
        commit('setFavorite', memberName);
      }
      commit('dumpToLocalStorage');
    },

    restoreFromLocalStorage({ commit }) {
      commit('restoreFromLocalStorage');
    },
  },
};
