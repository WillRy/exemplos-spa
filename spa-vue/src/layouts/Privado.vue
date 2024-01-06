<template>
  <div class="layout" v-if="!loading && usuarioState.usuario">
    <Sidebar
      :open="sidebarAberta"
      @change="mudarSidebar"
    >
      <template #logo>
        <img src="/logo.png" alt="">
      </template>
      <SidebarLink :to="{ name: 'dashboard' }">
        <template #texto> Dashboard </template>
        <template #icone>
          <HomeIcon />
        </template>
      </SidebarLink>
      <SidebarLink :to="{ name: 'organizacoes' }">
        <template #texto>
          {{ $t("palavras.organizacoes") }}
        </template>
        <template #icone>
          <OrganizacaoIcon />
        </template>
      </SidebarLink>
      <SidebarLink :to="{ name: 'contatos' }">
        <template #texto>
          {{ $t("palavras.contatos") }}
        </template>
        <template #icone>
          <ContatoIcon />
        </template>
      </SidebarLink>
      <SidebarLink :to="{ name: 'tags' }">
        <template #texto>
          {{ $t("palavras.tags") }}
        </template>
        <template #icone>
          <TagIcon />
        </template>
      </SidebarLink>
    </Sidebar>

    <Header :containerFluido="true">
      <template #boxDireito>
        <div class="row">
          <div class="col col-count" v-if="qtdOrganizacoes">
            <span>Organizações:</span>
            <span>{{ qtdOrganizacoes }}</span>
          </div>
          <div class="col">
            <BaseDropdownSecondary>
              <template #botao>
                {{ $i18n.locale }}
              </template>
              <template #acoes>
                <button @click="mudarIdioma('pt-BR')">Português</button>
                <button @click="mudarIdioma('en')">Inglês</button>
              </template>
            </BaseDropdownSecondary>
          </div>
          <div class="col">
            <BaseDropdownPrimary>
              <template #botao>
                {{ usuarioState.usuario.nome }}
              </template>
              <template #acoes>
                <button @click="logout">{{ $t("palavras.logout") }}</button>
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
    <Loader width="126px" height="126px" :corPrincipal="true" />
  </div>
</template>

<script>
import Header from "../external/components/header/Header.vue";
import Sidebar from "../external/components/sidebar/Sidebar.vue";
import SidebarLink from "../external/components/sidebar/SidebarLink.vue";
import HomeIcon from "../external/components/icons/HomeIcon.vue";
import HomeContainer from "../external/components/estrutura/HomeContainer.vue";
import { usuarioStore } from "../stores/usuario";
import OrganizacaoIcon from "../components/icons/OrganizacaoIcon.vue";
import ContatoIcon from "../components/icons/ContatoIcon.vue";
import BaseDropdownPrimary from "../external/components/dropdown/BaseDropdownPrimary";
import BaseButtonSecondary from "../external/components/buttons/BaseButtonSecondary";
import BaseDropdownSecondary from "../external/components/dropdown/BaseDropdownSecondary";
import TagIcon from "../components/icons/TagIcon";
import api from "../services/api";
import {
  modalCriarOrganizacaoStore,
  modalEditarOrganizacaoStore,
  modalExcluirOrganizacaoStore,
  organizacaoStore,
} from "../stores/organizacao";
import { definirIdioma } from "../lang";
import { emitter } from "../plugins";

export default {
  name: "Privado",
  components: {
    TagIcon,
    BaseDropdownSecondary,
    BaseButtonSecondary,
    BaseDropdownPrimary,
    Sidebar,
    Header,
    SidebarLink,
    HomeIcon,
    HomeContainer,
    OrganizacaoIcon,
    ContatoIcon,
  },
  setup() {
    const usuarioState = usuarioStore();
    const organizacaoState = organizacaoStore();
    const modalCriarOrganizacaoState = modalCriarOrganizacaoStore();
    const modalEditarOrganizacaoState = modalEditarOrganizacaoStore();
    const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();
    return {
      usuarioState,
      organizacaoState,
      modalCriarOrganizacaoState,
      modalEditarOrganizacaoState,
      modalExcluirOrganizacaoState,
    };
  },
  data() {
    return {
      loading: true,
      sidebarAberta: false,
      qtdOrganizacoes: null,
    };
  },
  watch: {
    "modalCriarOrganizacaoState.reload": {
      handler() {
        this.buscarQuantidadeOrganizacoes();
      },
    },
    "modalEditarOrganizacaoState.reload": {
      handler() {
        this.buscarQuantidadeOrganizacoes();
      },
    },
    "modalExcluirOrganizacaoState.reload": {
      handler() {
        this.buscarQuantidadeOrganizacoes();
      },
    },
  },
  methods: {
    mudarIdioma(lang) {
      this.$i18n.locale = lang;
      definirIdioma(lang);
    },
    mudarSidebar() {
      this.sidebarAberta = !this.sidebarAberta;
    },
    logout() {
      api.post("/logout").finally(() => {
        window.localStorage.removeItem("token");
        this.$router.push({
          path: "/",
        });
      });
    },
    buscarQuantidadeOrganizacoes() {
      api.get("/organizacao").then((r) => {
        this.qtdOrganizacoes = r.data.data.total;
      });
    },
  },
  async created() {
    this.buscarQuantidadeOrganizacoes();
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
.col-count {
  display: flex;
  align-items: center;
}
</style>
