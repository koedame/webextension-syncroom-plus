<template lang="pug">
b-navbar#navbar--custom(fixed-top)
  template(slot='brand')
    b-navbar-item(href="https://syncroom.yamaha.com/play/")
      img(:src='logoUrl', alt='SYNCROOM')
  template(slot='start')
  template(slot='end')
    b-navbar-item(href='https://syncroom.yamaha.com/play/')
      | ルーム一覧
    b-navbar-item(href='https://syncroom.yamaha.com/play/manual/index_pc.html', target="_blank", rel="noopener noreferrer")
      | マニュアル
    b-navbar-item(href='https://syncroom.yamaha.com/play/faq/index_pc.html', target="_blank", rel="noopener noreferrer")
      | よくある質問
    b-navbar-item(href='https://syncroom.yamaha.com/play/dl/', target="_blank", rel="noopener noreferrer")
      | ダウンロード
    b-navbar-item(href='https://syncroom.yamaha.com/play/information/', target="_blank", rel="noopener noreferrer")
      | お知らせ
    b-navbar-item(tag='div')
      b-button(type="is-normal", tag="a", href="https://syncroom.yamaha.com/", target="_blank", rel="noopener noreferrer", inverted, outlined)
        | SYNCROOM PORTAL SITE
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
const browser = require('webextension-polyfill');

export default defineComponent({
  setup() {
    return {
      logoUrl: browser.extension.getURL(`/images/logo_plus.png`),
    };
  },
});
</script>

<style lang="sass">
#navbar--custom
  background: #5074f5
  background-color: #5074f5

  .navbar-item
    color: #fff

    &:hover
      background: none
      opacity: 0.8
    &:active
      background: none
      opacity: 0.8
    &:focus
      background: none
      opacity: 0.8
    &:focus-within
      background: none
      opacity: 0.8

    img
      max-height: 36px

  .navbar-burger.burger
    color: #fff !important

  .navbar-menu.is-active
    background: #5074f5
    background-color: #5074f5
</style>
