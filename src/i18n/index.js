import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en';
import zh from './zh';

Vue.use(VueI18n);

const messages = {
  en,
  zh,
};

// detect language
const browserLang = window.navigator.language;
let defaultLang = 'zh';
if (browserLang.slice(0, 2) !== 'zh') {
  defaultLang = 'en';
}

const i18n = new VueI18n({
  locale: defaultLang,
  messages,
});

export default i18n;
