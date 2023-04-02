import { createI18n } from 'vue-i18n'
import pt_BR from './pt-BR';
import end from './en';


export const allowedLang = ['en','pt-BR'];

const messages = {
  ...pt_BR,
  ...end
}

// Create VueI18n instance with options
export function getLanguage() {
  // if has not choose language
  const language = (
    navigator.language || navigator.browserLanguage
  );
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return "en";
}

export const i18n = createI18n({
  locale: getLanguage(),
  messages, // set locale messages
});
