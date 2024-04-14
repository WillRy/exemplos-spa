<template>
  <div class="layout">
    <Sidebar
      :open="sidebarAberta"
      @change="mudarSidebar"

    >
      <template #logo>
        <img src="/logo.png" alt="">
      </template>
      <SidebarLink href="/painel" is="Link" :active="$page.url.endsWith('painel')">
        <template #texto> Dashboard </template>
        <template #icone>
          <HomeIcon />
        </template>
      </SidebarLink>
      <SidebarLink href="/organizacoes" is="Link" :active="$page.url.endsWith('organizacoes')">
        <template #texto>
          {{ $t("palavras.organizacoes") }}
        </template>
        <template #icone>
          <OrganizacaoIcon />
        </template>
      </SidebarLink>
      <SidebarLink href="/contatos" is="Link" :active="$page.url.endsWith('contatos')">
        <template #texto>
          {{ $t("palavras.contatos") }}
        </template>
        <template #icone>
          <ContatoIcon />
        </template>
      </SidebarLink>
      <SidebarLink href="/tags" is="Link" :active="$page.url.endsWith('tags')">
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
                <a href="/lang/pt-BR">Português</a>
                <a href="/lang/en">Inglês</a>
              </template>
            </BaseDropdownSecondary>
          </div>
          <div class="col">
            <BaseDropdownPrimary>
              <template #botao>
                {{ $page.props.usuario.nome }}
              </template>
              <template #acoes>
                <Link href="/logout">{{ $t("palavras.logout") }}</Link>
                <button
                  :disabled="!$verificaPermissao($page,'botao')"
                >
                  {{ $t("textos.botao_sem_permissao") }}
                </button>
              </template>
            </BaseDropdownPrimary>
          </div>
        </div>
      </template>
    </Header>

    <HomeContainer>
     <slot />
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
import OrganizacaoIcon from "../components/icons/OrganizacaoIcon.vue";
import ContatoIcon from "../components/icons/ContatoIcon.vue";
import BaseDropdownPrimary from "../external/components/dropdown/BaseDropdownPrimary";
import BaseButtonSecondary from "../external/components/buttons/BaseButtonSecondary";
import BaseDropdownSecondary from "../external/components/dropdown/BaseDropdownSecondary";
import TagIcon from "../components/icons/TagIcon";
import axiosWeb from "../services/axiosWeb";
import {
  modalCriarOrganizacaoStore,
  modalEditarOrganizacaoStore,
  modalExcluirOrganizacaoStore,
} from "../stores/organizacao";
import { definirIdioma } from "../lang";

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

    const modalCriarOrganizacaoState = modalCriarOrganizacaoStore();
    const modalEditarOrganizacaoState = modalEditarOrganizacaoStore();
    const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();
    return {
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
      definirIdioma(lang);
    },
    mudarSidebar() {
      this.sidebarAberta = !this.sidebarAberta;
    },
    buscarQuantidadeOrganizacoes() {
      axiosWeb.get("/organizacao").then((r) => {
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
