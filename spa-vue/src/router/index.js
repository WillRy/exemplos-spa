import {createRouter, createWebHistory} from "vue-router";
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import NaoEncontrado from "../views/NaoEncontrado";
import Privado from "../layouts/Privado";
import {usuarioStore} from "../stores/usuario";
import {useToast} from "vue-toast-notification";
import NProgress from "nprogress";
import {idiomasPermitidos, identificarIdioma, i18n} from "../lang";

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
            path: "/:lang(en|pt-BR)/painel",
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
                    next({path: "/"});
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
        {path: '/:pathMatch(.*)*', name: 'not-found', component: NaoEncontrado},
    ],
});

//definir o idioma da aplicação com base na rota
router.beforeEach(async (to, from, next) => {

    if (to.name === 'not-found') return next();

    const newLocale = to.params.lang
    const prevLocale = from.params.lang
    const targetLang = newLocale ?? prevLocale;


    const isAllowed = idiomasPermitidos.find((lang) => lang === newLocale);


    if (!targetLang) {
        to.params.lang = identificarIdioma();
        return next(to)
    }


    if (!isAllowed) {
        to.params.lang = identificarIdioma();
        return next(to)
    }


    // If the locale hasn't changed, do nothing
    if (newLocale === prevLocale) {
        return next();
    }

    document.querySelector("html").setAttribute("lang", newLocale);

    i18n.global.locale = newLocale;

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


export default router;
