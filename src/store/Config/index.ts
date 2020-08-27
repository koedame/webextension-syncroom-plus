const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  config: {
    autoReload: true,
  },
};

const getters: GetterTree<ConfigState, RootState> = {
  autoReload: (state) => {
    return state.config.autoReload;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state.config, config);
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(state.config)),
        });
      });
  },
  setAutoReload: (state, value: boolean) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state.config, config);
      })
      .then(() => {
        state.config.autoReload = value;
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(state.config)),
        });
      });
  },
};

const actions: ActionTree<ConfigState, RootState> = {
  setAutoReload({ commit }, value: boolean) {
    commit('setAutoReload', value);
  },
  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const config: Module<ConfigState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
