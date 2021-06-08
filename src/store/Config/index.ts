import { browser } from 'webextension-polyfill-ts';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';
import LanguageMap from '../language_map';

const state: ConfigState = {
  autoReload: true,
  animation: true,
  language: 'ja',
  rememberPassword: false,
};

const getters: GetterTree<ConfigState, RootState> = {
  autoReload: (state) => {
    return state.autoReload;
  },
  animation: (state) => {
    return state.animation;
  },
  language: (state) => {
    return state.language;
  },
  rememberPassword: (state) => {
    return state.rememberPassword;
  },
  languageDisplayName: (state) => {
    return LanguageMap[state.language].displayName;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local.get('configAutoReload').then(({ configAutoReload }) => {
      if (typeof configAutoReload !== 'undefined') {
        state.autoReload = configAutoReload;
      }
    });

    browser.storage.local.get('configAnimation').then(({ configAnimation }) => {
      if (typeof configAnimation !== 'undefined') {
        state.animation = configAnimation;
      }
    });

    browser.storage.local.get('configLanguage').then(({ configLanguage }) => {
      if (typeof configLanguage !== 'undefined') {
        state.language = configLanguage;
      } else {
        state.language = 'ja';
      }
    });

    browser.storage.local.get('configRememberPassword').then(({ configRememberPassword }) => {
      if (typeof configRememberPassword !== 'undefined') {
        state.rememberPassword = configRememberPassword;
      } else {
        state.rememberPassword = false;
      }
    });
  },

  setAutoReload: (state, value: boolean) => {
    browser.storage.local
      .set({
        configAutoReload: value,
      })
      .then(() => {
        state.autoReload = value;
      });
  },
  setAnimation: (state, value: boolean) => {
    browser.storage.local
      .set({
        configAnimation: value,
      })
      .then(() => {
        state.animation = value;
      });
  },
  setLanguage: (state, value: string) => {
    browser.storage.local
      .set({
        configLanguage: value,
      })
      .then(() => {
        state.language = value;
      });
  },
  setRememberPassword: (state, value: boolean) => {
    browser.storage.local
      .set({
        configRememberPassword: value,
      })
      .then(() => {
        state.rememberPassword = value;
      });
  },
  resetRememberPasswords: (state) => {
    browser.storage.local.set({
      roomPasswords: {},
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
  setLanguage({ commit }, value: string) {
    commit('setLanguage', value);
  },
  setRememberPassword({ commit }, value: boolean) {
    commit('setRememberPassword', value);
  },
  resetRememberPasswords({ commit }) {
    commit('resetRememberPasswords');
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
