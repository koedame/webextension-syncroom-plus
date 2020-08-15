export default {
  namespaced: true,

  state: {
    members: [],
  },

  mutations: {
    // storage.localからstateを復元
    restoreFromLocalStorage(state) {
      browser.storage.local.get('favoriteMembers__members').then(({ favoriteMembers__members }) => {
        Object.assign(state.members, favoriteMembers__members);
      });
    },

    // storage.localにstateを保存
    dumpToLocalStorage(state) {
      browser.storage.local.set({
        favoriteMembers__members: JSON.parse(JSON.stringify(state.members)),
      });
    },

    setFavorite(state, memberName) {
      if (!state.members.some(member => member.memberName === memberName)) {
        state.members.push({
          memberName: memberName,
          favoritedAt: new Date(),
        });
      }
    },
    removeFavorite(state, memberName) {
      state.members = state.members.filter(member => member.memberName !== memberName);
    },
  },

  actions: {
    toggleFavorite({ commit, state }, memberName) {
      if (state.members.some(member => member.memberName === memberName)) {
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
