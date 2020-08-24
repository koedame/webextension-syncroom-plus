<template lang="pug">
footer.footer
  .content.has-text-centered
    p
      b-tag(type="is-info")
        | SYNCROOM Plus Version {{ version }}


    p
      a(href='https://github.com/koedame/webextension-syncroom-plus', target="_blank", rel="noopener noreferrer")
        strong SYNCROOM Plus
      |
      | は
      |
      a(href='https://github.com/koedame/', target="_blank", rel="noopener noreferrer")
        strong
          |
          | 肥溜め
      |
      | が管理・運用しています。
      br
      | ソースコードは
      a(href='http://opensource.org/licenses/mit-license.php', target="_blank", rel="noopener noreferrer")
        | MITライセンス
      | のもとでライセンスされています。

    hr

    p
      b-tag(type="is-dark")
        | 😊
        |
        | Inspired by
        |
        b SYNCROOM-utility
        | .
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
