import { idiomasPermitidos, identificarIdioma, i18n } from "../lang";

export function configuraIdioma(to, from, next) {
  const lang = window.localStorage.getItem("@lang");

  const isAllowed = idiomasPermitidos.find((idioma) => idioma === lang);

  if (isAllowed) {
    document.querySelector("html").setAttribute("lang", lang);
    i18n.global.locale = lang;
  } else {
    const lang = identificarIdioma();
    window.localStorage.setItem("@lang", lang);
    document.querySelector("html").setAttribute("lang", lang);
    i18n.global.locale = lang;
  }

  next();
}
