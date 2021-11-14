<template lang="pug">
.modal-card
  .modal-card-head
    .modal-card-title
      b-icon(icon="mobile-alt", size="is-small")
      |
      | {{ translate("share_room") }}
  .modal-card-body

      b-field(:label="translate('room_name')", horizontal, :message="translate(error.message)", :type="error.type")
        b-input(v-model="roomName", required, :placeholder="translate('room_name')")

      b-field(:label="translate('password')", horizontal)
        b-radio-button(v-model="isPasswordRequired", :native-value="false", type="is-info")
          b-icon(icon='lock-open')
          | {{translate('password_disabled')}}
        b-radio-button(v-model="isPasswordRequired", :native-value="true", type="is-dark")
          b-icon(icon='lock')
          | {{translate('password_enabled')}}

      hr

      b-message(type="is-success")
        | {{translate('discription_qr')}}

      .box
        vue-qrcode(:value="url", tag="img", :margin="0")

        b-field
          b-input(v-model="url", readonly, expanded)
          .control
            b-button(v-if="isCopied", @click="onCopyUrl", type="is-success", icon-left="clipboard-check")
              | {{translate('copied_link')}}

            b-button(v-else, @click="onCopyUrl", icon-left="clipboard")
              | {{translate('copy_link')}}

  .modal-card-foot
    b-button(@click="$emit('close')", icon-left="times") {{ translate("close") }}
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { translate } from '../../lib/i18n';
import VueQrcode from 'vue-qrcode';

export default defineComponent({
  components: {
    VueQrcode,
  },

  setup() {
    const roomName = ref('');
    const isPasswordRequired = ref(false);

    const url = computed(() => {
      let password = '0';
      if (isPasswordRequired.value) {
        password = '1';
      }
      return `https://webapi.syncroom.appservice.yamaha.com/ndroom/launch_app?roomName=${encodeURIComponent(roomName.value)}&requirePassword=${password}`;
    });

    const error = computed(() => {
      let result = {
        type: 'is-success',
        message: '',
      };

      if (roomName.value.length === 0) {
        result = {
          type: 'is-danger',
          message: 'empty_room_name_message',
        };
      }
      return result;
    });

    const isCopied = ref(false);

    const urlInput = ref(null);
    const copyTimer = ref(null);

    const onCopyUrl = () => {
      navigator.clipboard.writeText(url.value);

      isCopied.value = true;

      if (copyTimer.value) {
        clearTimeout(copyTimer.value);
      }

      copyTimer.value = setTimeout(() => {
        isCopied.value = false;
      }, 3000);
    };

    return {
      urlInput,
      onCopyUrl,
      isCopied,
      error,
      url,
      roomName,
      isPasswordRequired,
      translate,
    };
  },
});
</script>
