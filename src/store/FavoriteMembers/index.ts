import { browser } from 'webextension-polyfill-ts';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { FavoriteMembersState, FavoriteMember, RootState } from '../types';

const state: FavoriteMembersState = {
  members: [],
};

const getters: GetterTree<FavoriteMembersState, RootState> = {
  members: (state) => {
    return [].concat(state.members);
  },
};

const mutations: MutationTree<FavoriteMembersState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('favoriteMembers')
      // @ts-ignore
      .then(({ favoriteMembers }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof favoriteMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(favoriteMembers)) {
            const members: Array<FavoriteMember> = [];

            for (const favoriteMember of favoriteMembers) {
              if (typeof favoriteMember.memberName === 'undefined') {
                continue;
              }

              const member: FavoriteMember = { memberName: favoriteMember.memberName, createdAt: '' };

              if (typeof favoriteMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(favoriteMember.createdAt).toISOString();
              }

              members.push(member);
            }

            state.members = members;
          } else {
            state.members = [];
          }
        }
      })
      .then(() => {
        browser.storage.local.set({
          favoriteMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },

  setFavorite: (state, memberName: string) => {
    browser.storage.local
      .get('favoriteMembers')
      // @ts-ignore
      .then(({ favoriteMembers }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof favoriteMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(favoriteMembers)) {
            const members: Array<FavoriteMember> = [];

            for (const favoriteMember of favoriteMembers) {
              if (typeof favoriteMember.memberName === 'undefined') {
                continue;
              }

              const member: FavoriteMember = { memberName: favoriteMember.memberName, createdAt: '' };

              if (typeof favoriteMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(favoriteMember.createdAt).toISOString();
              }

              members.push(member);
            }

            state.members = members;
          } else {
            state.members = [];
          }
        }
      })
      .then(() => {
        if (!state.members.some((member: FavoriteMember) => member.memberName === memberName)) {
          state.members.push({
            memberName: memberName,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        browser.storage.local.set({
          favoriteMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },
  removeFavorite(state, memberName: string) {
    browser.storage.local
      .get('favoriteMembers')
      // @ts-ignore
      .then(({ favoriteMembers }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof favoriteMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(favoriteMembers)) {
            const members: Array<FavoriteMember> = [];

            for (const favoriteMember of favoriteMembers) {
              if (typeof favoriteMember.memberName === 'undefined') {
                continue;
              }

              const member: FavoriteMember = { memberName: favoriteMember.memberName, createdAt: '' };

              if (typeof favoriteMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(favoriteMember.createdAt).toISOString();
              }

              members.push(member);
            }

            state.members = members;
          } else {
            state.members = [];
          }
        }
      })
      .then(() => {
        state.members = state.members.filter((member) => member.memberName !== memberName);
      })
      .then(() => {
        browser.storage.local.set({
          favoriteMembers: JSON.parse(JSON.stringify(state.members)),
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

  removeFavorite: ({ commit, state }, memberName: string) => {
    commit('removeFavorite', memberName);
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
