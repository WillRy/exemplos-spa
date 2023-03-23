import { createRouter, createWebHistory } from "vue-router";
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import Privado from "../layouts/Privado";
import Lang from "../layouts/Lang";
import { defineAsyncComponent } from "vue";
import { usuarioStore } from "../stores/usuario";
import { useToast } from "vue-toast-notification";
import NProgress from "nprogress";
import { getLanguage, i18n } from "../lang";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:lang(en|pt-BR)?",
      component: Publico,
      name: "publico",
      children: [
        {
          path: "",
          name: "login",
          component: Login,
        },
        {
          path: "esqueci-senha",
          name: "esqueci-senha",
          component: () => import("../views/auth/EsqueciSenha"),
        },
        {
          path: "redefinir-senha",
          name: "redefinir-senha",
          component: () => import("../views/auth/RedefinirSenha"),
        },
      ],
    },
    {
      path: "/:lang/painel",
      component: Privado,
      meta: {
        permissoes: [],
      },
      async beforeEnter(from, to, next) {
        try {
          const usuarioState = usuarioStore();
          await usuarioState.carregarUsuarioLogado();

          next();
        } catch (error) {
          console.log(error);
          const toast = useToast();
          toast.open({
            type: "error",
            message: "Erro ao carregar dados do usuario",
          });
          window.localStorage.removeItem("token");
          next({ path: "/" });
        }
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/Dashboard"),
        },
        {
          path: "organizacoes",
          name: "organizacoes",
          component: () => import("../views/Organizacoes"),
        },
        {
          path: "contatos",
          name: "contatos",
          component: () => import("../views/Contatos"),
        },
        {
          path: "sem-permissao",
          name: "sem-permissao",
          meta: {
            permissoes: ["permissao-qualquer"],
          },
          component: () => import("../views/Contatos"),
        },
      ],
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

//definir o idioma da aplicação com base na rota
router.beforeEach((to, from, next) => {
  const paramsLocale = to.params.lang;

  if (!paramsLocale) {
    return next({ name: "login", params: { lang: getLanguage() } });
  }
  document.querySelector("html").setAttribute("lang", paramsLocale);

  i18n.global.locale = paramsLocale;
  next();
});

//exibir o loader em troca de pagina
router.beforeEach((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
  }
  next();
});

//verifica permissoes de rota
router.beforeEach((to, from, next) => {
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean);

  const usuarioState = usuarioStore();
  const permissoesUsuario = usuarioState.permissoes;

  const usuarioTemPermissao = permissoesRotas.every((elem) =>  {
    return permissoesUsuario.includes(elem)
  });

  if (usuarioTemPermissao || permissoesRotas.length === 0) {
    next();
  } else {
    const toast = useToast();
    toast.open({
      type: "error",
      message: i18n.global.t("message.rota_sem_permissao"),
    });
    next(from);
  }
});

//remove o loader em troca de pagina
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
