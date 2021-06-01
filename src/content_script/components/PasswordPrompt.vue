<template lang="pug">
.modal-card
  .modal-card-head
    .modal-card-title
      b-icon.mr-1(icon="lock")
      | {{translate('please_enter_room_password')}}
  .modal-card-body
    b-field(:label="translate('room_name')")
      b-input(:placeholder="translate('room_name')", readonly, :value="roomName", disabled)

    form(@submit.prevent="onJoin")
      b-field.mb-5(
        :label="translate('password')",
        :type="{ 'is-danger': hasError }",
      )
        b-input.password(v-model="password", type="is-info", :placeholder="translate('password')", ref="passwordElement", minlength="1", required, @input="savePassword")

    .level
      .level-left
        b-button(@click="$emit('close')", icon-left="times") {{ translate("close") }}
      .level-right
        b-button(@click="onJoin", type="is-info", :disabled="hasError")
          template(v-if="temporaly")
            | {{translate('temporary_entry')}}
          template(v-else)
            | {{translate('join')}}
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, SetupContext, computed } from '@vue/composition-api';
import { translate } from '../../lib/i18n';
import makeJoinUri from '../../lib/make_join_uri';
import store from '../../store';

import { browser } from 'webextension-polyfill-ts';

type Props = {
  roomName: string;
  temporaly: boolean;
};

export default defineComponent({
  props: {
    roomName: {
      type: String,
      required: true,
    },
    temporaly: {
      type: Boolean,
      required: true,
    },
  },

  setup(props: Props, context: SetupContext) {
    const passwordElement = ref(null);
    onMounted(() => {
      passwordElement.value.focus();
    });

    const password = ref('');
    if (store.getters['config/rememberPassword']) {
      browser.storage.local.get('roomPasswords').then(({ roomPasswords }) => {
        if (typeof roomPasswords !== 'undefined' && roomPasswords[props.roomName]) {
          password.value = roomPasswords[props.roomName];
        }
      });
    }

    const savePassword = () => {
      if (store.getters['config/rememberPassword']) {
        browser.storage.local.get('roomPasswords').then(({ roomPasswords }) => {
          if (typeof roomPasswords === 'undefined') {
            roomPasswords = {};
          }

          roomPasswords[props.roomName] = password.value;

          browser.storage.local.set({
            roomPasswords: roomPasswords,
          });
        });
      }
    };

    const onJoin = () => {
      savePassword();

      location.href = makeJoinUri(props.roomName, password.value, props.temporaly);
      context.emit('close');
    };

    const hasError = computed(() => {
      return password.value.length < 1;
    });

    return {
      hasError,
      translate,
      password,
      onJoin,
      passwordElement,
      savePassword,
    };
  },
});
</script>
