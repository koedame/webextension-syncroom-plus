<template lang="pug">
.modal-card
  .modal-card-head
    .modal-card-title
      b-icon(icon="cog")
      |
      | {{ translate('settings') }}
  .modal-card-body
    .section
      .subtitle
        b-icon(icon="cog")
        |
        | {{ translate('settings') }}

      b-switch(v-model="configAutoReload", type="is-info", @input="onInputAutoReload")
        | {{ translate('auto_reload') }}

      b-switch(v-model="configAnimation", type="is-info", @input="onInputAnimation")
        | {{ translate('animation') }}

      b-switch(v-model="configRememberPassword", type="is-info", @input="onInputRememberPassword")
        | {{ translate('remember_password') }}

      hr

      .subtitle
        b-icon(icon="star")
        |
        | {{ translate('manage_favorites', {length: favoriteMembers.length}) }}
      b-message(type="is-info", v-if="favoriteMembers.length === 0")
        | {{ translate("missing_favorites1") }}
        b-icon(icon="star")
        | {{ translate("missing_favorites2") }}
      b-table(:data="favoriteMembers", v-else, narrowed, bordered)

        b-table-column(:label="translate('user_name')", v-slot="props")
          | {{ props.row.memberName }}

        b-table-column(:label="translate('date_added')", v-slot="props")
          | {{ props.row.createdAt | moment('llll') }}

        b-table-column(:label="translate('action')", v-slot="props")
          b-button(type="is-danger", size="is-small", icon-left="trash", @click="confirmRemoveFavorite(props.row.memberName)")
            | {{ translate("remove") }}

      hr

      .subtitle
        b-icon(icon="bell")
        |
        | {{ translate('manage_online_notifications', {length: notificationOnlineMembers.length}) }}
      b-message(type="is-info", v-if="notificationOnlineMembers.length === 0")
        | {{ translate("missing_online_notifications1") }}
        b-icon(icon="bell")
        | /
        b-icon(icon="bell-slash")
        | {{ translate("missing_online_notifications2") }}
      b-table(:data="notificationOnlineMembers", v-else, narrowed, bordered)

        b-table-column(:label="translate('user_name')", v-slot="props")
          | {{ props.row.memberName }}

        b-table-column(:label="translate('date_added')", v-slot="props")
          | {{ props.row.createdAt | moment('llll') }}

        b-table-column(:label="translate('action')", v-slot="props")
          b-button(type="is-danger", size="is-small", icon-left="trash", @click="confirmRemoveNotification(props.row.memberName)")
            | {{ translate("remove") }}

      hr
      .subtitle
        b-icon(icon="info-circle")
        |
        | {{ translate("other") }}

      b-button(type="is-danger", icon-left="trash", @click="onResetPasswords")
        | {{ translate("remove_remember_passwords") }}

  .modal-card-foot
    b-button(@click="$emit('close')", icon-left="times") {{ translate("close") }}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { translate } from '../../lib/i18n';
import store from '../../store';
import { DialogProgrammatic as Dialog, ToastProgrammatic as Toast } from 'buefy';

export default defineComponent({
  setup() {
    const onInputAutoReload = (value: boolean) => {
      store.dispatch('config/setAutoReload', value);
    };

    const onInputAnimation = (value: boolean) => {
      store.dispatch('config/setAnimation', value);
    };

    const onInputRememberPassword = (value: boolean) => {
      store.dispatch('config/setRememberPassword', value);
    };

    const confirmRemoveFavorite = (memberName: string) => {
      Dialog.confirm({
        title: translate('unfavorite_user?'),
        message: translate('unfavorite_user', { username: memberName }),
        confirmText: translate('remove'),
        cancelText: translate('close'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          store.dispatch('favoriteMembers/removeFavorite', memberName).then((res) => {
            Toast.open({
              message: translate('succeeded_unfavorite'),
              type: 'is-success',
            });
          });
        },
      });
    };

    const confirmRemoveNotification = (memberName: string) => {
      Dialog.confirm({
        title: translate('cancel_notification?'),
        message: translate('confirme_cancel_notification', { username: memberName }),
        confirmText: translate('remove'),
        cancelText: translate('close'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          store.dispatch('notificationOnlineMembers/removeNotification', memberName).then((res) => {
            Toast.open({
              message: translate('succeeded_cancel_notification'),
              type: 'is-success',
            });
          });
        },
      });
    };

    const favoriteMembers = computed(() => {
      return store.getters['favoriteMembers/members'];
    });

    const notificationOnlineMembers = computed(() => {
      return store.getters['notificationOnlineMembers/members'];
    });

    const onResetPasswords = () => {
      Dialog.confirm({
        title: translate('do_you_want_to_remove_the_passwords'),
        message: translate('remove_the_saved_password_this_operation_cannot_be_undone'),
        confirmText: translate('remove'),
        cancelText: translate('close'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          store.dispatch('config/resetRememberPasswords').then((res) => {
            Toast.open({
              message: translate('password_has_been_deleted'),
              type: 'is-success',
            });
          });
        },
      });
    };

    return {
      configAutoReload: store.getters['config/autoReload'],
      configAnimation: store.getters['config/animation'],
      configRememberPassword: store.getters['config/rememberPassword'],
      onInputAutoReload,
      onInputAnimation,
      onInputRememberPassword,
      confirmRemoveFavorite,
      confirmRemoveNotification,
      favoriteMembers,
      notificationOnlineMembers,
      translate,
      onResetPasswords,
    };
  },
});
</script>
