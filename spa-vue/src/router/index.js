import { createRouter, createWebHistory } from "vue-router";
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import NaoEncontrado from "../views/NaoEncontrado";
import Privado from "../layouts/Privado";
import { usuarioStore } from "../stores/usuario";
import { useToast } from "vue-toast-notification";
import NProgress from "nprogress";
import { idiomasPermitidos, identificarIdioma, i18n } from "../lang";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/lang/:lang",
      name: "lang",
      //se eu estiver logado, envia para a dashboard
      async beforeEnter(from, to, next) {
        const lang = to.params.lang ?? from.params.lang;

        window.localStorage.setItem("@lang", lang);

        if (from.fullPath !== to.fullPath) {
          return next({
            name: "login",
          });
        }

        return next(from);
      },
    },
    {
      path: "/",
      component: Publico,
      name: "publico",
      async beforeEnter(from, to, next) {
        const usuarioState = usuarioStore();
        const logado = await usuarioState.carregarUsuarioLogado();
        if (logado) {
          return next({ name: "dashboard" });
        }
        return next();
      },
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
        {
          path: "logout",
          name: "logout",
          component: Login,
          async beforeEnter(from, to, next) {
            debugger;
            const usuarioState = usuarioStore();
            await usuarioState.logout();
            next({ path: "/" });
          },
        },
      ],
    },
    {
      path: "/painel",
      component: Privado,
      meta: {
        permissoes: [],
      },
      async beforeEnter(from, to, next) {
        const usuarioState = usuarioStore();
        const logado = await usuarioState.carregarUsuarioLogado();
        if (logado) {
          return next();
        }
        const toast = useToast();
        toast.open({
          type: "error",
          message: "Erro ao carregar dados do usuario",
        });
        window.localStorage.removeItem("token");
        next({ name: "login" });
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
          path: "org2",
          name: "org2",
          component: () => import("../views/OrganizacoesPinia"),
        },
        {
          path: "contatos",
          name: "contatos",
          component: () => import("../views/Contatos"),
        },
        {
          path: "tags",
          name: "tags",
          component: () => import("../views/Tags"),
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
    { path: "/:pathMatch(.*)*", name: "not-found", component: NaoEncontrado },
  ],
});

//definir o idioma da aplicação com base na rota
router.beforeEach((to, from, next) => {
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

//remove o loader em troca de pagina
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

//verifica permissoes de rota
router.beforeEach((to, from, next) => {
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean);

  const usuarioState = usuarioStore();
  const permissoesUsuario = usuarioState.permissoes;

  const usuarioTemPermissao = permissoesRotas.every((elem) => {
    return permissoesUsuario.includes(elem);
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

export default router;
