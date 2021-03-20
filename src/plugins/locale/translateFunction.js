import l_En from './locales/en';
import l_Ru from './locales/ru';

export default function t (val, locale) {
  if (locale == "ru") {
    if (l_Ru.strings[val])
      return l_Ru.strings[val];
    else
      return `!${val}!`;
  }
  else {
    if (l_En.strings[val])
      return l_En.strings[val];
    else
      return `!${val}!`;
  }
}