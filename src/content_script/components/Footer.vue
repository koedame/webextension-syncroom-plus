<template lang="pug">
footer.footer
  .content.has-text-centered
    p
      b-tag(type="is-info")
        | SYNCROOM Plus Version {{ version }}

    p
      strong SYNCROOM Plus
      |
      | は
      |
      a(href='https://twitter.com/koedamedev', target="_blank", rel="noopener noreferrer")
        strong
          | 肥溜め
        | @koedamedev
      |
      | が管理・運用しています。
</template>

<script>
const browser = require('webextension-polyfill');

export default {
  data() {
    return {
      version: browser.runtime.getManifest().version,
    };
  },
};
</script>
