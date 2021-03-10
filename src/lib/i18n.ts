import { browser } from "webextension-polyfill-ts";
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'ja',
  messages: require('../i18n.json'),
});

// restoreFromLocalStorage でうまく設定反映されないので個別の処理で対応
browser.storage.local
  .get('configLanguage')
  // @ts-ignore
  .then(({ configLanguage }) => {
    if (typeof configLanguage !== 'undefined') {
      i18n.locale = configLanguage;
    } else {
      i18n.locale = 'ja';
    }
  });

const translate = (key: string, option?: any) => {
  if (!key) {
    return '';
  }
  return String(i18n.t(key, option));
};

export { i18n, translate };
