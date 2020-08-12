<template lang="pug">
.volume_meter
  span.volume_meter__block(v-for="i in 15")
  span.volume_meter__mask(:style="`width: ${num}px`")
</template>

<script>
export default {
  computed: {
    num() {
      this.$store.state.clock.queue;
      return Math.floor(Math.random() * 7) * 5 + 180;
    },
  },
};
</script>

<style lang="sass" scoped>
.volume_meter
  background: #000
  width: 100%
  height: 9px
  padding: 3px
  overflow: hidden
  position: relative

  &__block
    vertical-align: top
    display: inline-block
    width: 2px
    height: 3px
    background: #24E332
    margin-right: 2px
  &__mask
    height: 9px
    background: #000
    position: absolute
    top: 0
    right: 0
</style>
