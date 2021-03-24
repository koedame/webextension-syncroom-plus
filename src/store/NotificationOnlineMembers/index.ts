import { browser } from "webextension-polyfill-ts";
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { NotificationOnlineMembersState, NotificationOnlineMember, RootState } from '../types';

const state: NotificationOnlineMembersState = {
  members: [],
};

const getters: GetterTree<NotificationOnlineMembersState, RootState> = {
  members: (state) => {
    return [].concat(state.members);
  },
};

const mutations: MutationTree<NotificationOnlineMembersState> = {
  restoreFromLocalStorage(state) {
    browser.storage.local
      .get('notificationOnlineMembers')
      //@ts-ignore
      .then(({ notificationOnlineMembers }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof notificationOnlineMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(notificationOnlineMembers)) {
            let members: Array<NotificationOnlineMember> = [];

            for (let notificationOnlineMember of notificationOnlineMembers) {
              if (typeof notificationOnlineMember.memberName === 'undefined') {
                continue;
              }

              let member: NotificationOnlineMember = {
                memberName: notificationOnlineMember.memberName,
                createdAt: '',
                lastNotificationRoomCreatedTime: '',
              };

              if (typeof notificationOnlineMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationOnlineMember.createdAt).toISOString();
              }

              if (typeof notificationOnlineMember.lastNotificationRoomCreatedTime === 'undefined') {
                member.lastNotificationRoomCreatedTime = '';
              } else {
                member.lastNotificationRoomCreatedTime = notificationOnlineMember.lastNotificationRoomCreatedTime;
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
          notificationOnlineMembers: JSON.parse(JSON.stringify(state.members)),
        });
      });
  },

  setNotification(state, { memberName, roomCreateTime }) {
    browser.storage.local
      .get('notificationOnlineMembers')
      //@ts-ignore
      .then(({ notificationOnlineMembers }) => {
        // データがないときはエラーが起こるので初期化
        if (typeof notificationOnlineMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(notificationOnlineMembers)) {
            let members: Array<NotificationOnlineMember> = [];

            for (let notificationOnlineMember of notificationOnlineMembers) {
              if (typeof notificationOnlineMember.memberName === 'undefined') {
                continue;
              }

              let member: NotificationOnlineMember = {
                memberName: notificationOnlineMember.memberName,
                createdAt: '',
                lastNotificationRoomCreatedTime: '',
              };

              if (typeof notificationOnlineMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationOnlineMember.createdAt).toISOString();
              }

              if (typeof notificationOnlineMember.lastNotificationRoomCreatedTime === 'undefined') {
                member.lastNotificationRoomCreatedTime = '';
              } else {
                member.lastNotificationRoomCreatedTime = notificationOnlineMember.lastNotificationRoomCreatedTime;
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
        if (!state.members.find((m) => m.memberName === memberName)) {
          state.members.push({
            memberName: memberName,
            createdAt: new Date().toISOString(),
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
        // データがないときはエラーが起こるので初期化
        if (typeof notificationOnlineMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(notificationOnlineMembers)) {
            let members: Array<NotificationOnlineMember> = [];

            for (let notificationOnlineMember of notificationOnlineMembers) {
              if (typeof notificationOnlineMember.memberName === 'undefined') {
                continue;
              }

              let member: NotificationOnlineMember = {
                memberName: notificationOnlineMember.memberName,
                createdAt: '',
                lastNotificationRoomCreatedTime: '',
              };

              if (typeof notificationOnlineMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationOnlineMember.createdAt).toISOString();
              }

              if (typeof notificationOnlineMember.lastNotificationRoomCreatedTime === 'undefined') {
                member.lastNotificationRoomCreatedTime = '';
              } else {
                member.lastNotificationRoomCreatedTime = notificationOnlineMember.lastNotificationRoomCreatedTime;
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
        // データがないときはエラーが起こるので初期化
        if (typeof notificationOnlineMembers === 'undefined') {
          state.members = [];
        } else {
          if (Array.isArray(notificationOnlineMembers)) {
            let members: Array<NotificationOnlineMember> = [];

            for (let notificationOnlineMember of notificationOnlineMembers) {
              if (typeof notificationOnlineMember.memberName === 'undefined') {
                continue;
              }

              let member: NotificationOnlineMember = {
                memberName: notificationOnlineMember.memberName,
                createdAt: '',
                lastNotificationRoomCreatedTime: '',
              };

              if (typeof notificationOnlineMember.createdAt === 'undefined') {
                member.createdAt = new Date().toISOString();
              } else {
                member.createdAt = new Date(notificationOnlineMember.createdAt).toISOString();
              }

              if (typeof notificationOnlineMember.lastNotificationRoomCreatedTime === 'undefined') {
                member.lastNotificationRoomCreatedTime = '';
              } else {
                member.lastNotificationRoomCreatedTime = notificationOnlineMember.lastNotificationRoomCreatedTime;
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
