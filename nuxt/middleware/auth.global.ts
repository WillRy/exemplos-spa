import type { Usuario } from "~/composables/useUsuario";
export default defineNuxtRouteMiddleware(async (to, from) => {
  

  const { usuario } = useUsuario();

  const isPrivate = to.path.includes("/painel");

  const haveLogout = to.fullPath.includes("logout");

  const navigateBetweenPublic = from.path !== to.path && !from.path.includes("/painel") && !isPrivate;

  //OBS: SOMENTE PARA TESTES E DEBUG
  // if(import.meta.server) {
  //   await useNuxtApp().$getCsrf();
  //   await useApi("/login", {
  //     method: "POST",
  //   });
  // }
  

  if (haveLogout) {
    usuario.value = null;
    return;
  }

  if (!usuario.value && !haveLogout && !navigateBetweenPublic) {
    const { data } = await useApi<{
      data: Usuario;
    }>("/usuario");

    if (data.value?.data) {
      usuario.value = data.value?.data;
    }
  }

  if (usuario.value && !isPrivate && !haveLogout) {
    return navigateTo("/painel/dashboard");
  }

  if (!usuario.value && isPrivate && !haveLogout) {
    return navigateTo("/?logout=3");
  }
});
