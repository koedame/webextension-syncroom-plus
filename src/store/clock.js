import moment from 'moment';
export default {
  namespaced: true,

  state: {
    currentTime: null,
    queue: null,
  },

  mutations: {
    seCurrentTime(state, currentTime) {
      state.currentTime = currentTime;
    },
    seQueue(state, queue) {
      state.queue = queue;
    },
  },

  actions: {
    fetch({ commit }) {
      commit('seCurrentTime', moment());
    },
    updateQueue({ commit }) {
      commit('seQueue', Math.random());
    },
  },
};
