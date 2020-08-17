<template lang="pug">
span {{ remainingTime }}
</template>

<script>
import moment from 'moment';
require('moment-timezone');

export default {
  props: {
    createTime: {
      type: String,
      required: true,
    },
  },
  created() {
    this.endAt = moment(this.createTime, 'YYYY-MM-DD hh:mm:ss zz').add(6, 'h');
  },

  computed: {
    remainingTime() {
      const remainingTime = this.endAt.diff(this.$store.state.clock.currentTime);
      return moment(remainingTime).format('HH:mm:ss');
    },
  },
};
</script>
