import moment from 'moment';
export default {
  namespaced: true,

  state: {
    currentTime: null,
  },

  mutations: {
    seCurrentTime(state, currentTime) {
      state.currentTime = currentTime;
    },
  },

  actions: {
    fetch({ commit }) {
      commit('seCurrentTime', moment());
    },
  },
};
