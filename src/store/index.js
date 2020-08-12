import Vue from 'vue';
import Vuex from 'vuex';

// import rooms from './rooms.js';
import clock from './clock.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    clock: clock,
  },
});
