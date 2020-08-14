export default {
  namespaced: true,

  state: {
    members: [],
  },

  mutations: {
    setFavorite(state, member) {
      state.members.push(member);
      state.members = state.members.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    },
    removeFavorite(state, removeMember) {
      state.members = state.members.filter(member => member !== removeMember);
    },
  },

  actions: {
    toggleFavorite({ commit, state }, { member }) {
      if (state.members.includes(member)) {
        commit('removeFavorite', member);
      } else {
        commit('setFavorite', member);
      }
    },
    isFavorite({ state }, { member }) {
      return state.members.includes(member);
    },
  },
};
