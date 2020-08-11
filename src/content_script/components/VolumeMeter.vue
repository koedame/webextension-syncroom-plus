<template lang="pug">
.volume_meter
  span.volume_meter__block(v-for="i in num")
</template>

<script>
export default {
  data() {
    return { num: 5, timer: null };
  },
  created() {
    this.timer = setInterval(() => {
      this.num = Math.floor(Math.random() * (10 - 1) + 1);
    }, 200);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
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

  &__block
    vertical-align: top
    display: inline-block
    width: 2px
    height: 3px
    background: #24E332
    margin-right: 2px
</style>
