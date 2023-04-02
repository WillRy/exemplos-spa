<template>
  <div class="subheader">
    <div class="subheader-container">

      <div class="titulo">
        <div class="btnEsquerdo" v-if="$slots.btnEsquerdo">
          <BaseButtonTertiary size="sm" @click="voltar">
            <slot name="btnEsquerdo"></slot>
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
        <router-link :to="{name: homeUrlName}">
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
import BaseButtonTertiary from "../buttons/BaseButtonTertiary";
import HomeIcon from "../icons/HomeIcon";

export default {
  name: "SubHeader",
  props: {
    homeUrlName: {
      type: String,
      default: 'dashboard'
    }
  },
  components: {HomeIcon, BaseButtonTertiary},
  methods: {
    voltar() {
      this.$emit("voltar")
    }
  }
}
</script>

<style scoped>
.subheader {
  display: flex;
  flex-direction: column;
}

.subheader-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.botoes {
  display: flex;
  align-items: center;
  gap: 21px;
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
}

.breadcrumb {
  display: grid;
  grid-template-columns: 20px 1fr;
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
  color: var(--second-color-500);
}

.separador {
  height: 1px;
  background: #E1E2E6;
  opacity: 1;
  margin: 20px 0px;
}
</style>