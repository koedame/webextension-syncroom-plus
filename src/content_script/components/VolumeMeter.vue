<template lang="pug">
.volume_meter
  img.volume_meter__image(:src="volumeMeterImageLink")
</template>

<script>
export default {
  data() {
    return {
      volumeMeterImageLink: null,
    };
  },
  mounted() {
    this.volumeMeterImageLink = browser.extension.getURL(`/images/volume-meter-${Math.floor(Math.random() * Math.floor(20))}.gif`);
  },
};
</script>

<style lang="sass" scoped>
.volume_meter
  background: #000
  width: 100%
  height: 9px

  &__image
    vertical-align: top
</style>
