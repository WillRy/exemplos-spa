<template>
  <div class="layout" v-if="!loading && usuarioState.usuario">
    <Sidebar :open="sidebarAberta" @change="mudarSidebar" :iconeEmresaSrc="'/fff.webp'">
      <SidebarLink :to="{name:'dashboard'}">
        <template #texto>
          Dashboard
        </template>
        <template #icone>
          <HomeIcon/>
        </template>
      </SidebarLink>
      <SidebarLink :to="{name:'organizacoes'}">
        <template #texto>
          {{ $t('palavras.organizacoes') }}
        </template>
        <template #icone>
          <OrganizacaoIcon/>
        </template>
      </SidebarLink>
      <SidebarLink :to="{name:'contatos'}">
        <template #texto>
          {{ $t('palavras.contatos') }}
        </template>
        <template #icone>
          <ContatoIcon/>
        </template>
      </SidebarLink>
    </Sidebar>

    <Header>
      <template #boxEsquerdo>
        <div class="row">
          <div class="col">
            <BaseDropdownSecondary>
              <template #botao>
                {{ $i18n.locale }}
              </template>
              <template #acoes>
                <button @click="mudarIdioma('pt-BR')">
                  Português
                </button>
                <button @click="mudarIdioma('en')">
                  Inglês
                </button>
              </template>
            </BaseDropdownSecondary>
          </div>
          <div class="col">
            <BaseDropdownPrimary>
              <template #botao>
                {{ usuarioState.usuario.nome }}
              </template>
              <template #acoes>
                <button @click="logout">Sair</button>
                <button
                    :disabled="!usuarioState.temPermissao('botao')"
                    v-if="!usuarioState.temPermissao('botao')"
                >
                  {{ $t("textos.botao_sem_permissao") }}
                </button>
                <button v-else>
                  {{ $t("textos.botao_sem_permissao") }}
                </button>
              </template>
            </BaseDropdownPrimary>
          </div>
        </div>
      </template>
    </Header>



    <HomeContainer>
      <router-view key="privado" :key="$route.path"></router-view>
    </HomeContainer>
  </div>
  
  <div class="loader-overlay" v-if="loading">
    <Loader width="126px" height="126px" :corPrincipal="true"/>
  </div>
</template>

<script>
import Header from "../external/components/header/Header.vue";
import Sidebar from "../external/components/sidebar/Sidebar.vue";
import SidebarLink from "../external/components/sidebar/SidebarLink.vue";
import HomeIcon from "../external/components/icons/HomeIcon.vue";
import HomeContainer from "../external/components/HomeContainer.vue";
import {usuarioStore} from "../stores/usuario";
import OrganizacaoIcon from "../components/icons/OrganizacaoIcon.vue";
import ContatoIcon from "../components/icons/ContatoIcon.vue";
import BaseDropdownPrimary from "../external/components/dropdown/BaseDropdownPrimary";
import BaseButtonSecondary from "../external/components/buttons/BaseButtonSecondary";
import BaseDropdownSecondary from "../external/components/dropdown/BaseDropdownSecondary";

export default {
  name: "Privado",
  components: {
    BaseDropdownSecondary,
    BaseButtonSecondary,
    BaseDropdownPrimary,
    Sidebar,
    Header,
    SidebarLink,
    HomeIcon,
    HomeContainer,
    OrganizacaoIcon,
    ContatoIcon
  },
  setup() {
    const usuarioState = usuarioStore();
    return {
      usuarioState,
    };
  },
  data() {
    return {
      loading: true,
      sidebarAberta: false
    };
  },
  methods: {
    mudarIdioma(lang) {
      // const route = this.$router.resolve({
      //   params: {
      //     lang: lang
      //   }
      // });
      // window.location.href = route.fullPath;


      this.$router.push({
        params: {
          lang: lang
        }
      });

    },
    mudarSidebar() {
      this.sidebarAberta = !this.sidebarAberta;
    },
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push({
        path: "/",
      });
    },
  },
  async created() {
    // this.loading = true;

    // let token = window.localStorage.getItem("token");
    // if (token) {

    //     await this.usuarioState.carregarUsuarioLogado()
    //         .catch(() => {
    //             window.localStorage.removeItem("token");
    //             this.$router.push({name: 'login'})
    //         })
    // } else {
    //     await this.$router.push({name: 'login'})
    // }

    this.loading = false;
  },
};
</script>

<style>
body {
  background: #f3f3f3;
}

.loader-overlay {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
