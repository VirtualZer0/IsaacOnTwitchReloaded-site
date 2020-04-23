import Vue from 'vue';
import l_En from './locales/en';
import l_Ru from './locales/ru';

Vue.filter("t", (val, locale) => {

  if (locale == "ru") {
    return l_Ru.strings[val];
  }
  else {
    return l_En.strings[val];
  }
});

