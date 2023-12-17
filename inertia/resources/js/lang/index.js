import { createI18n } from 'vue-i18n'
import pt_BR from './pt-BR';
import end from './en';


export const idiomasPermitidos = ['en','pt-BR'];

const messages = {
  ...pt_BR,
  ...end
}

export const i18n = createI18n({
  locale: identificarIdioma(),
  messages, // set locale messages
  legacy: false
});


// Create VueI18n instance with options
export function identificarIdioma() {
  // if has not choose language
  const language = (
    document.querySelector("html").getAttribute("lang") || navigator.language || navigator.browserLanguage
  );
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return "en";
}

export function definirIdioma(lang) {
  const isAllowed = idiomasPermitidos.find((idioma) => idioma === lang);

  if(isAllowed) {
    document.querySelector("html").setAttribute("lang", lang);
    i18n.global.locale = lang;
  } else {
    const langDetectada = identificarIdioma();
    window.localStorage.setItem("@lang", langDetectada)
    document.querySelector("html").setAttribute("lang", langDetectada);
    i18n.global.locale = langDetectada;
  }
}


