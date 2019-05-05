import Vue from 'vue';
import l_En from './en';
import l_Ru from './ru';

Vue.filter("t", (val, local) => {

 if (local == "ru") {
    return l_Ru.strings[val];
  }
  else {
    return l_En.strings[val];
  }
});