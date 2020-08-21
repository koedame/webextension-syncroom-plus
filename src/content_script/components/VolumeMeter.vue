<template lang="pug">
.volume_meter
  img.volume_meter__image(:src="volumeMeterImageLink")
</template>

<script lang="ts">
const browser = require('webextension-polyfill');
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup() {
    return {
      volumeMeterImageLink: browser.extension.getURL(`/images/volume-meter-${Math.floor(Math.random() * Math.floor(20))}.gif`),
    };
  },
});
</script>

<style lang="sass" scoped>
.volume_meter
  background: #000
  width: 100%
  height: 11px

  &__image
    vertical-align: top
    width: 220px
    height: 11px
</style>
