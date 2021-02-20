import moment = require('moment');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ClockState, RootState } from '../types';

const state: ClockState = {
  currentTime: moment(),
};

const getters: GetterTree<ClockState, RootState> = {
  currentTime: (state) => {
    return state.currentTime;
  }
};

const mutations: MutationTree<ClockState> = {
  seCurrentTime: (state, currentTime: any) => {
    state.currentTime = moment();
  },
};

const actions: ActionTree<ClockState, RootState> = {
  fetch: ({ commit }) => {
    commit('seCurrentTime', moment());
  },
};

export const clock: Module<ClockState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
