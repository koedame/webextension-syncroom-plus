<template lang="pug">
.card
  iframe.syncroom-plus-contact-form(
    src="https://docs.google.com/forms/d/e/1FAIpQLSeGXG8E9_dEfy1vEKV8DdZ5RGNSVIKQOh_3yenXWTGPJRpRmA/viewform?embedded=true",
    frameborder="0",
    marginheight="0",
    marginwidth="0"
  ) 読込中
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({});
</script>

<style lang="sass" scoped>
.syncroom-plus-contact-form
  width: 100%
  height: 70vh
</style>
