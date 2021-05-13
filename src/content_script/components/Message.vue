<template lang="pug">
.section(v-if="isExists")
  b-message(:title="title", :type="`is-${notificationType}`", :has-icon="hasIcon", :closable="closable")
    | {{ description }}
    br
    | {{ startAt | moment("llll") }}
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from '@vue/composition-api';
import axiosClient from '../../lib/axios';

export default defineComponent({
  setup() {
    const isExists = ref(false);
    const title = ref('');
    const description = ref('');
    const notificationType = ref('is-info');
    const closable = ref(false);
    const startAt = ref('');
    const endAt = ref('');
    const hasIcon = ref(false);
    const timer = ref(null);
    const fetch = () => {
      axiosClient
        .get('/api/v1/notifications/latest')
        .then((res) => {
          isExists.value = true;
          title.value = res.data.data.notification.title;
          description.value = res.data.data.notification.description;
          notificationType.value = res.data.data.notification.notification_type;
          closable.value = res.data.data.notification.closable;
          startAt.value = res.data.data.notification.start_at;
          endAt.value = res.data.data.notification.end_at;
          hasIcon.value = res.data.data.notification.has_icon;
        })
        .catch((e) => {
          isExists.value = false;
        });
    };

    fetch();

    timer.value = setInterval(fetch, 60000);

    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      isExists,
      title,
      description,
      notificationType,
      closable,
      startAt,
      endAt,
      hasIcon,
    };
  },
});
</script>
