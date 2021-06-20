<template lang="pug">
.Card(v-show="display")
  .Card__Body
    a.ALink(:href="aData.link", target="_blank", rel="noopener noreferrer")
      img.AImage(:src="aData.image_src")

    b-button.CloseButton(size="is-small", type="is-dark", @click="toggleControlDisplay", v-if="!controlDisplay")
      b-icon(icon="times-circle")

    .AControlArea(v-if="controlDisplay")
      b-field(position="is-centered", grouped)
        .control
          b-button(size="is-small", @click="toggleControlDisplay", type="is-default is-light") {{translate('cancel')}}
        .control
          b-button(size="is-small", type="is-success", @click="onIgnoreAd") {{translate('do_not_display')}}
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeUnmount } from '@vue/composition-api';

import store from '../../store';

import { translate } from '../../lib/i18n';
import axiosClient from '../../lib/axios';

export default defineComponent({
  // Adという文字を使うと広告ブロッカーが反応するので避ける
  setup() {
    const aData = ref({
      version: 0,
      uuid: '',
      image_src: '',
      link: '',
      start_at: '',
      end_at: '',
      name: '',
    });

    const controlDisplay = ref(false);

    const toggleControlDisplay = () => {
      controlDisplay.value = !controlDisplay.value;
    };

    const fetch = () => {
      axiosClient
        .get('/api/v1/a/current')
        .then((res) => {
          aData.value = res.data;
        })
        .catch((e) => {
          aData.value.version = 0;
          return false;
        });
    };

    fetch();

    const timer = ref(null);
    timer.value = setInterval(fetch, 60 * 1000);

    const onIgnoreAd = () => {
      store.dispatch('ignoreAds/setIgnoreAd', aData.value.uuid);
      return false;
    };

    const display = computed(() => {
      // 無視リストに入っていたら無視
      if (
        store.getters['ignoreAds/ignoreAds'].some((ignoreAd: any) => {
          return ignoreAd.uuid === aData.value.uuid;
        })
      ) {
        return false;
      }

      // バージョン非対応の場合は無視
      if (aData.value.version !== 1) {
        return false;
      }

      const now = new Date().getTime();

      // 開始前の場合は無視
      if (Date.parse(aData.value.start_at) > now) {
        return false;
      }

      // 終了後の場合は無視
      if (Date.parse(aData.value.end_at) < now) {
        return false;
      }

      return true;
    });

    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      onIgnoreAd,
      toggleControlDisplay,
      controlDisplay,
      aData,
      translate,
      display,
    };
  },
});
</script>

<style lang="sass" scoped>
.Card
  margin: 5px 5px 15px 5px
  width: 300px
  background: #D9E2FE
  border-radius: 5px
  box-shadow: 0px 1px 8px -5px #20293a
  overflow: hidden
  position: relative

.ALink
  display: inline-block
  &:hover
    opacity: 0.75

.AImage
  display: inline-block
  height: 498px
  width: 300px
  vertical-align: bottom

.CloseButton
  position: absolute
  top: 0
  right: 0
  border-radius: 0 !important

.AControlArea
  background: #ffffff
  position: absolute
  top: 0
  right: 0
  height: 498px
  width: 300px
  padding: 230px 0
</style>
