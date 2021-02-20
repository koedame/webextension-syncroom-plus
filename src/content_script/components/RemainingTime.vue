<template lang="pug">
span {{ remainingTime }}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

import store from '../../store';

const moment = require('moment');
require('moment-timezone');

type Props = {
  createTime: string;
};

export default defineComponent({
  props: {
    createTime: {
      type: String,
      required: true,
    },
  },

  setup(props: Props) {
    const remainingTime = computed(() => {
      const endAt = moment(props.createTime, 'YYYY-MM-DD hh:mm:ss zz').add(6, 'h');
      const r = endAt.diff(store.getters['clock/currentTime']);
      return moment(r).format('HH:mm:ss');
    });

    return {
      remainingTime,
    };
  },
});
</script>
