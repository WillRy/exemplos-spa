import { createRouter, createWebHistory } from 'vue-router'
import { usuarioStore } from '../stores/usuario'
import { configuraIdioma, mudarIdioma } from '../middlewares/configuraIdioma'
import { iniciaLoader, terminaLoader } from '../middlewares/loaders'
import { apiPublic } from '../services/api'
import { auth } from '@/middlewares/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/lang/:lang',
      name: 'lang',
      beforeEnter: [mudarIdioma]
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/auth/Login'),
      async beforeEnter(from, to, next) {
        const usuarioState = usuarioStore()
        await usuarioState.logout()
        return next({ name: 'login', query: { logout: 1 } })
      }
    },
    // rotas publicas
    {
      path: '/',
      component: () => import('../layouts/Publico'),
      name: 'publico',
      beforeEnter: [],
      meta: {
        public: true
      },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('../views/auth/Login')
        },
        {
          path: 'esqueci-senha',
          name: 'esqueci-senha',
          component: () => import('../views/auth/EsqueciSenha')
        },
        {
          path: 'redefinir-senha',
          name: 'redefinir-senha',
          component: () => import('../views/auth/RedefinirSenha')
        }
      ]
    },
    // rotas privadas
    {
      path: '/painel',
      component: () => import('../layouts/Privado'),
      meta: {
        permissoes: [],
        privado: true
      },
      beforeEnter: [],
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/Dashboard')
        },
        {
          path: 'organizacoes',
          name: 'organizacoes',
          component: () => import('../views/Organizacoes')
        },
        {
          path: 'contatos',
          name: 'contatos',
          component: () => import('../views/Contatos')
        },
        {
          path: 'tags',
          name: 'tags',
          component: () => import('../views/Tags')
        },
        {
          path: 'sem-permissao',
          name: 'sem-permissao',
          meta: {
            permissoes: ['permissao-qualquer']
          },
          component: () => import('../views/Contatos')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NaoEncontrado')
    }
  ]
})

router.beforeEach(configuraIdioma)

router.beforeEach(iniciaLoader)

router.afterEach(terminaLoader)

router.beforeEach(auth)

// get a new csrf token in each request
router.beforeEach(async (from, to, next) => {
  await apiPublic.get('/csrf')
  return next()
})

export default router
