<template lang="pug">
b-navbar#navbar--custom(fixed-top)
  template(slot='brand')
    b-navbar-item(tag="div")
      img(:src='logoUrl', alt='SYNCROOM')
  template(slot='start')
    b-navbar-item(tag="div")
        b-button(icon-left="mobile-alt", type="is-warning is-light", outlined,@click="openShare")
          | {{ translate("share_room") }}

  template(slot='end')
    b-navbar-item(tag="div")
      .buttons
        b-dropdown.mr-2(aria-role='list')
          template(#trigger)
            b-button(type='is-default', icon-left="language", icon-right="angle-down")
              | Language: {{ $store.getters['config/languageDisplayName'] }}
          b-dropdown-item(aria-role='listitem', @click="changeLanguage('en')") English
          b-dropdown-item(aria-role='listitem', @click="changeLanguage('ja')") Japanese (日本語)
          b-dropdown-item(aria-role='listitem', @click="changeLanguage('ko')") Korean (한국어)

        b-button(icon-left="cog", type="is-info", outlined, @click="openConfig")
          | {{ translate('settings') }}
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { i18n, translate } from '../../lib/i18n';
import store from '../../store';
import { ModalProgrammatic as Modal } from 'buefy';
import Config from './Config.vue';
import Share from './Share.vue';
import { browser } from 'webextension-polyfill-ts';

export default defineComponent({
  setup() {
    const changeLanguage = (lang: string) => {
      store.dispatch('config/setLanguage', lang);
      i18n.locale = lang;
    };

    const openShare = () => {
      Modal.open({
        component: Share,
        hasModalCard: true,
      });
    };

    const openConfig = () => {
      Modal.open({
        component: Config,
        hasModalCard: true,
      });
    };

    return {
      logoUrl: browser.extension.getURL(`/images/logo_plus_black.png`),
      changeLanguage,
      openShare,
      openConfig,
      translate,
    };
  },
});
</script>

<style lang="sass">
#navbar--custom
  // background: #5074f5
  // background-color: #5074f5

  .navbar-item
    // color: #fff

    &:hover
      background: white
      opacity: 1
    &:active
      background: white
      opacity: 1
    &:focus
      background: white
      opacity: 1
    &:focus-within
      background: white
      opacity: 1

    img
      max-height: 36px

  .navbar-burger.burger
    // color: #fff !important

  .navbar-menu.is-active
    // background: #5074f5
    // background-color: #5074f5
</style>
