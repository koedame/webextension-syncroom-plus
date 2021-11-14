<template lang="pug">
footer.footer
  .content.has-text-centered
    p
      b-tag(type="is-info")
        | SYNCROOM Plus Version {{ version }}

    p
      | {{ translate("developed_by") }}
      a(href='https://twitter.com/koedamedev', target="_blank", rel="noopener noreferrer")
        strong
          | 肥溜め
        | @koedamedev
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { translate } from '../../lib/i18n';
import { browser } from 'webextension-polyfill-ts';

export default defineComponent({
  setup() {
    return {
      version: browser.runtime.getManifest().version,
      translate,
    };
  },
});
</script>
