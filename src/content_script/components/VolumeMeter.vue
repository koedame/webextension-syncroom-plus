<template lang="pug">
.volume_meter
  img.volume_meter__image(:src="volumeMaterUrl")
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    volumeMaterUrl: {
      type: String,
      required: true,
    }
  }
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
