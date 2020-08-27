const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  autoReload: true,
  animation: true,
};

const getters: GetterTree<ConfigState, RootState> = {
  autoReload: (state) => {
    return state.autoReload;
  },
  animation: (state) => {
    return state.animation;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state, config);
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(state)),
        });
      });
  },
  setAutoReload: (state, value: boolean) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state, config);
      })
      .then(() => {
        state.autoReload = value;
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(config)),
        });
      });
  },
  setAnimation: (state, value: boolean) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state, config);
      })
      .then(() => {
        state.animation = value;
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(config)),
        });
      });
  },
};

const actions: ActionTree<ConfigState, RootState> = {
  setAutoReload({ commit }, value: boolean) {
    commit('setAutoReload', value);
  },
  setAnimation({ commit }, value: boolean) {
    commit('setAnimation', value);
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
