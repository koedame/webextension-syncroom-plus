const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { NotificationOnlineMembersState, RootState } from '../types';

const state: NotificationOnlineMembersState = {
  members: [],
};

const getters: GetterTree<NotificationOnlineMembersState, RootState> = {
  members: (state) => {
    return state.members;
  },
};

const mutations: MutationTree<NotificationOnlineMembersState> = {
  restoreFromLocalStorage(state) {
    //@ts-ignore
    browser.storage.local.get('notificationOnlineMembers').then(({ notificationOnlineMembers }) => {
      state.members = notificationOnlineMembers || [];
    });
  },

  setNotification(state, { memberName, roomCreateTime }) {
    browser.storage.local
      .get('notificationOnlineMembers')
      //@ts-ignore
      .then(({ notificationOnlineMembers }) => {
        state.members = notificationOnlineMembers || [];
      })
      .then(() => {
        if (!state.members.find((m) => m.memberName === memberName)) {
          state.members.push({
            memberName: memberName,
            createdAt: new Date(),
            lastNotificationRoomCreatedTime: roomCreateTime,
          });
        }
      })
      .then(() => {
        browser.storage.local.set({
          notificationOnlineMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },

  updateNotification(state, { memberName, roomCreateTime }) {
    browser.storage.local
      .get('notificationOnlineMembers')
      //@ts-ignore
      .then(({ notificationOnlineMembers }) => {
        state.members = notificationOnlineMembers || [];
      })
      .then(() => {
        if (state.members.some((m) => m.memberName === memberName)) {
          const members = state.members.filter((m) => m.memberName !== memberName);

          const member = state.members.some((m) => m.memberName === memberName);

          members.push({
            memberName: memberName,
            //@ts-ignore
            createdAt: member.createdAt,
            lastNotificationRoomCreatedTime: roomCreateTime,
          });

          state.members = members;
        }
      })
      .then(() => {
        browser.storage.local.set({
          notificationOnlineMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },

  removeNotification(state, memberName) {
    browser.storage.local
      .get('notificationOnlineMembers')
      //@ts-ignore
      .then(({ notificationOnlineMembers }) => {
        state.members = notificationOnlineMembers || [];
      })
      .then(() => {
        state.members = state.members.filter((m) => m.memberName !== memberName);
      })
      .then(() => {
        browser.storage.local.set({
          notificationOnlineMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },
};

const actions: ActionTree<NotificationOnlineMembersState, RootState> = {
  removeNotification({ commit }, memberName) {
    commit('removeNotification', memberName);
  },

  setNotification({ commit }, { memberName, roomCreateTime }) {
    commit('setNotification', { memberName, roomCreateTime });
  },

  updateNotification({ commit }, { memberName, roomCreateTime }) {
    commit('updateNotification', { memberName, roomCreateTime });
  },

  toggle({ commit, state }, { memberName, roomCreateTime }) {
    if (state.members.some((member) => member.memberName === memberName)) {
      commit('removeNotification', memberName);
    } else {
      commit('setNotification', { memberName, roomCreateTime });
    }
  },

  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const notificationOnlineMembers: Module<NotificationOnlineMembersState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
