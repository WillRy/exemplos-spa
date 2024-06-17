import { i18n } from '@/lang/index.js';
import { usuarioStore } from '@/stores/usuario.js'
import { useToast } from 'vue-toast-notification';

export const auth = async (to, from, next) => {
  debugger;
  const usuarioState = usuarioStore()

  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean)

  let rotaEstaComoPrivada = to.matched.map((record) => record.meta.privado).find(Boolean)

  let logado = usuarioState.isLoggedIn;
  if(!logado) {
    logado = await usuarioState.carregarUsuarioLogado()
  }

  //se está vindo de um login ou logout forçado, deixa entrar
  const fazendoNovoLogin = from.query.logout || to.query.logout || to.query.k || to.query.token || to.name === 'logout';
  if(fazendoNovoLogin) {
    return next()
  }

  //se rota é privada e não to logado, redireciona para o login
  if(rotaEstaComoPrivada && !logado) {
    return next({
      name: 'login',
      query: {
        logout: 1
      }
    })
  }

  //se rota é publica e estou logado, envia para a home
  if(!rotaEstaComoPrivada && logado) {
    return next({
      name: 'dashboard'
    })
  }

  //se tem permissão, deixa entrar, caso contrário leva para a home
  const permissoesUsuario = usuarioState.permissoes

  const usuarioTemPermissao = permissoesRotas.filter((permissao) => {
    return permissoesUsuario.includes(permissao)
  })

  if (usuarioTemPermissao.length || permissoesRotas.length === 0) {
    next()
  } else {
    const toast = useToast()
    toast.open({
      type: 'error',
      message: i18n.global.t('message.rota_sem_permissao')
    })

    next({name: 'dashboard'})
  }
}
