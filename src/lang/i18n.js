import I18n from 'react-native-i18n';
import fr from 'Wook_Market/src/lang/fr';
import zh from 'Wook_Market/src/lang/zh';
import en from 'Wook_Market/src/lang/en';

I18n.defaultLocale = 'fr';
I18n.fallbacks = true;

I18n.translations = {fr, zh, en};

export function _(name, params = {}) {
  return I18n.t(name, params);
}

export const currentLocale = I18n.currentLocale();
console.log(currentLocale);

export default I18n;
