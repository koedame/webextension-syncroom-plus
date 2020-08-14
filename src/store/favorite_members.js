export default {
  namespaced: true,

  state: {
    members: [],
  },

  mutations: {
    setFavorite(state, memberName) {
      if (!state.members.some(member => member.memberName === memberName)) {
        state.members.push({ memberName: memberName, favoritedAt: new Date() });
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
    },
  },
};
