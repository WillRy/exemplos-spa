import { i18n } from '@/lang/index.js'
import { usuarioStore } from '@/stores/usuario.js'
import { useToast } from 'vue-toast-notification'

/**
 * Middleware de permissão
 */
export const auth = async (to, from, next) => {
  const toRouteIsPrivate = to.matched.some((record) => record.meta.privado)

  const fromRouteIsPublic = from.matched.some((record) => !record.meta.privado);

  const betweenPublic = fromRouteIsPublic && !toRouteIsPrivate;

  const fromNotFound = from.name === 'not-found';

  const usuarioState = usuarioStore()

  if(to.name === 'not-found' || to.name === 'logout') {
    return next();
  }

  if(!usuarioState.isLoggedIn && !to.query.logout && !betweenPublic || fromNotFound) {
    try {
      await usuarioState.carregarUsuarioLogado();
    } catch (error) {
      console.error(error);
    }
  }

  if (toRouteIsPrivate && !usuarioState.isLoggedIn) {
    return next({name: 'login'})
  }

  if (!toRouteIsPrivate && usuarioState.isLoggedIn) {
    return next({name: 'dashboard'})
  }

  const permissoesUsuario = usuarioState.permissoes

  //verifica se rota contém um meta indicando que a lista de permissões
  /**
   * meta: {
   *  permissoes: ['xpto']
   * }
   */
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean)

  const usuarioTemPermissao = permissoesRotas.filter((permissao) => {
    return permissoesUsuario.includes(permissao)
  })

  if (usuarioTemPermissao.length || permissoesRotas.length === 0) {
    return next()
  } else {
    const toast = useToast()
    toast.open({
      type: 'error',
      message: i18n.global.t('message.rota_sem_permissao')
    })

    return next({ name: 'dashboard' })
  }
}
