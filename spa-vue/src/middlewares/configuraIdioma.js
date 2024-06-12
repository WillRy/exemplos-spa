import { idiomasPermitidos, identificarIdioma, i18n } from '../lang'

export function configuraIdioma(to, from, next) {
  const lang = window.localStorage.getItem('@lang')

  const isAllowed = idiomasPermitidos.find((idioma) => idioma === lang)

  if (isAllowed) {
    document.querySelector('html').setAttribute('lang', lang)
    i18n.global.locale.value = lang
  } else {
    const lang = identificarIdioma()
    window.localStorage.setItem('@lang', lang)
    document.querySelector('html').setAttribute('lang', lang)
    i18n.global.locale.value = lang
  }

  next()
}

export function mudarIdioma(to, from, next) {
  const lang = to.params.lang ?? from.params.lang

  window.localStorage.setItem('@lang', lang)

  const toDifferent = to.name !== 'lang'
  const fromDifferent = from.name !== 'lang'

  if (toDifferent) {
    return next(to)
  }

  if (fromDifferent) {
    return next(from)
  }

  return next('/')
}
