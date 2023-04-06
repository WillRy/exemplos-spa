import { createI18n } from 'vue-i18n'
import pt_BR from './pt-BR';
import end from './en';


export const idiomasPermitidos = ['en','pt-BR'];

const mensagens = {
  ...pt_BR,
  ...end
}

// Create VueI18n instance with options
export function identificarIdioma() {
  // if has not choose language
  const language = (
    navigator.language || navigator.browserLanguage
  );
  const locales = Object.keys(mensagens);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return "en";
}

export const i18n = createI18n({
  locale: identificarIdioma(),
  messages: mensagens, // set locale messages
});
