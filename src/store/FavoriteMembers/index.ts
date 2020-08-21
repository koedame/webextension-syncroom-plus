const browser = require('webextension-polyfill');

import moment = require('moment');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { FavoriteMembersState, FavoriteMember, RootState } from '../types';

const state: FavoriteMembersState = {
  members: [],
};

const getters: GetterTree<FavoriteMembersState, RootState> = {};

const mutations: MutationTree<FavoriteMembersState> = {
  // storage.localからstateを復元
  restoreFromLocalStorage: (state) => {
    //@ts-ignore
    browser.storage.local.get('favoriteMembers').then(({ favoriteMembers }) => {
      state.members = favoriteMembers || [];
    });
  },

  setFavorite: (state, memberName: string) => {
    browser.storage.local
      .get('favoriteMembers')
      //@ts-ignore
      .then(({ favoriteMembers }) => {
        state.members = favoriteMembers || [];
      })
      .then(() => {
        if (!state.members.some((member: FavoriteMember) => member.memberName === memberName)) {
          state.members.push({
            memberName: memberName,
            favoritedAt: new Date(),
          });
        }
      })
      .then(() => {
        browser.storage.local.set({
          favoriteMembers: state.members,
        });
      });
  },
  removeFavorite(state, memberName: string) {
    browser.storage.local
      .get('favoriteMembers')
      //@ts-ignore
      .then(({ favoriteMembers }) => {
        state.members = favoriteMembers || [];
      })
      .then(() => {
        state.members = state.members.filter((member) => member.memberName !== memberName);
      })
      .then(() => {
        browser.storage.local.set({
          favoriteMembers: state.members,
        });
      });
  },
};

const actions: ActionTree<FavoriteMembersState, RootState> = {
  toggleFavorite: ({ commit, state }, memberName: string) => {
    if (state.members.some((member) => member.memberName === memberName)) {
      commit('removeFavorite', memberName);
    } else {
      commit('setFavorite', memberName);
    }
  },

  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const favoriteMembers: Module<FavoriteMembersState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
