<template>
  <div class="subheader">
    <div class="subheader-container">

      <div class="titulo">
        <div class="btnEsquerdo" v-if="exibirVoltar">
          <BaseButtonTertiary size="sm" @click="voltar">
            <ArrowSidebar/>
          </BaseButtonTertiary>
        </div>
        <slot name="titulo"></slot>
      </div>


      <div class="botoes" v-if="$slots.botoes">
        <slot name="botoes">

        </slot>
      </div>
    </div>
    <div class="breadcrumb">
      <div class="link-home">
        <router-link :to="homeUrlName">
          <HomeIcon/>
        </router-link>
      </div>
      <div class="links">
        <slot name="links"></slot>
      </div>

    </div>

    <div class="separador"></div>

  </div>
</template>

<script>
import BaseButtonTertiary from "../buttons/BaseButtonTertiary.vue";
import HomeIcon from "../icons/HomeIcon.vue";
import ArrowSidebar from "../sidebar/ArrowSidebar.vue";

export default {
  name: "SubHeader",
  data() {
    return {
      exibirVoltar: this.exibirBtnVoltar,
    }
  },
  watch: {
    exibirBtnVoltar(valor) {
      this.exibirVoltar = valor
    }
  },
  props: {
    exibirBtnVoltar: {
      type: Boolean,
      default: true
    },
    homeUrlName: {
      type: String,
      default: 'dashboard'
    }
  },
  components: {ArrowSidebar, HomeIcon, BaseButtonTertiary},
  methods: {
    voltar() {
      this.$emit("voltar")
    }
  },
  created() {

  }
}
</script>

<style scoped>
.subheader {
  display: flex;
  flex-direction: column;
  margin-top: var(--spacing-4);
}

.subheader-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
  justify-content: space-between;
}

.botoes {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 12px;
}

.titulo {
  font-size: 20px;
  line-height: 24px;
  color: #2F3033;
  font-weight: bold;
  flex-shrink: 0;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

.breadcrumb {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 9px;
}

.link-home :deep(path) {
  fill: var(--tertiary-color-600);
}

.link-home:hover :deep(path) {
  fill: var(--tertiary-color-400);
}

.links {
  display: flex;
  align-items: center;
}

.links :deep(a) {
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;

}

.links :deep(a):hover {
  opacity: 0.6;
}

.links :deep(a:not(:first-child):before) {
  content: ' | ';
  display: block;
  margin: 4px;
  color: #606266 !important;
}

.links :deep(a:not(:last-child) ) {
  color: #606266;
}

.links :deep(a:last-child) {
  color: var(--primary-color-400);
}

.separador {
  height: 1px;
  background: #E1E2E6;
  opacity: 1;
  margin: 20px 0px;
}
</style>