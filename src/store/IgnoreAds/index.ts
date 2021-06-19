import { browser } from 'webextension-polyfill-ts';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { IgnoreAdsState, RootState } from '../types';

const state: IgnoreAdsState = {
  ignoreAds: [],
};

const getters: GetterTree<IgnoreAdsState, RootState> = {
  ignoreAds: (state) => {
    return [].concat(state.ignoreAds);
  },
};

const mutations: MutationTree<IgnoreAdsState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('ignoreAds')
      .then(({ ignoreAds }) => {
        if (Array.isArray(ignoreAds)) {
          state.ignoreAds = ignoreAds;
        } else {
          // データがないときはエラーが起こるので初期化
          state.ignoreAds = [];
        }
      })
      .then(() => {
        browser.storage.local.set({
          ignoreAds: JSON.parse(JSON.stringify(state.ignoreAds)),
        });
      });
  },

  setIgnoreAd: (state, uuid: string) => {
    console.log(uuid);
    browser.storage.local
      .get('ignoreAds')
      .then(({ ignoreAds }) => {
        // データがないときはエラーが起こるので初期化
        if (!Array.isArray(ignoreAds)) {
          state.ignoreAds = [];
        }

        state.ignoreAds.push({ uuid });
        console.log(state.ignoreAds);

        // 重複削除
        state.ignoreAds = state.ignoreAds.filter((x, i, self) => {
          return self.indexOf(x) === i;
        });
      })
      .then(() => {
        browser.storage.local.set({
          ignoreAds: JSON.parse(JSON.stringify(state.ignoreAds)),
        });
      });
  },
};

const actions: ActionTree<IgnoreAdsState, RootState> = {
  setIgnoreAd: ({ commit }, uuid: string) => {
    commit('setIgnoreAd', uuid);
  },

  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const ignoreAds: Module<IgnoreAdsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
