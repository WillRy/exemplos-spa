import { usuarioStore } from '@/stores/usuario.js'

export const redirectIfAuth = async (to, from, next) => {
  //indica que foi logout forçado, pois não conseguiu recuperar uma sessão ativa
  // const metaPublic = to.matched.some((record) => record.meta.public)
  if (from.query.logout || to.query.logout ) {
    return next()
  }

  const usuarioState = usuarioStore()
  const logado = await usuarioState.carregarUsuarioLogado()

  if (logado) {
    return next({ name: 'dashboard' })
  }
  return next()
}

export const auth = async (to, from, next) => {
  const usuarioState = usuarioStore()

  const logado = await usuarioState.carregarUsuarioLogado()

  if (logado) {
    return next()
  }

  return next({
    name: 'login',
    query: {
      logout: 3
    }
  })
}
