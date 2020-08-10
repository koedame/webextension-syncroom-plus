import axios from 'axios';

export default {
  namespaced: true,

  state: {
    data: null,
  },

  mutations: {
    setData(state, data) {
      state.data = data
    },
  },
  actions: {
    async fetch({
      commit
    }) {
      await axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then(res => {
        commit('setData', res.data)
      });
    },
  },
}
