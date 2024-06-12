<template>
  <div class="subheader" :style="{ padding: padding }">
    <div class="subheader-container">
      <div class="titulo">
        <slot name="titulo"></slot>
      </div>

      <div class="botoes" v-if="$slots.botoes">
        <slot name="botoes"> </slot>
      </div>
    </div>

    <div class="links">
      <template v-for="(link, index) in links" :key="index">
        <span class="breadcrumb-separador" v-if="index !== 0">></span>
        <component
          class="breadcrumb-item"
          :is="componentLink"
          :class="{ atual: index == links.length - 1 }"
          size="sm"
          :href="link.link"
          :to="link.link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12.56"
            height="9.767"
            viewBox="0 0 12.56 9.767"
            v-if="index === 0"
          >
            <path
              d="M6.113,4.036,2.093,7.347v3.573a.349.349,0,0,0,.349.349l2.443-.006a.349.349,0,0,0,.347-.349V8.827a.349.349,0,0,1,.349-.349h1.4a.349.349,0,0,1,.349.349v2.085a.349.349,0,0,0,.349.35l2.443.007a.349.349,0,0,0,.349-.349V7.345L6.446,4.036A.266.266,0,0,0,6.113,4.036Zm6.35,2.25-1.823-1.5V1.764a.262.262,0,0,0-.262-.262H9.157a.262.262,0,0,0-.262.262V3.347L6.944,1.741a1.047,1.047,0,0,0-1.33,0L.094,6.287a.262.262,0,0,0-.035.368l.556.676a.262.262,0,0,0,.369.036L6.113,3.142a.266.266,0,0,1,.334,0l5.129,4.224a.262.262,0,0,0,.368-.035l.556-.676a.262.262,0,0,0-.037-.369Z"
              transform="translate(0.001 -1.502)"
              fill="#939599"
            />
          </svg>

          <CaptionText class="breadcrumb-nome">{{ link.nome }}</CaptionText>
        </component>
      </template>
    </div>

    <div class="separador"></div>
  </div>
</template>

<script lang="ts">
import BaseButtonTertiary from "../buttons/BaseButtonTertiary.vue";
import CaptionText from "../text/CaptionText.vue";
import HomeIcon from "../icons/HomeIcon.vue";
import ArrowSidebar from "../sidebar/ArrowSidebar.vue";

import { PropType, defineComponent } from 'vue';
interface tipoLink {
    nome: string,
    link: string
}

export default defineComponent({
  name: "SubHeader",
  props: {
    links: {
      type: Array as PropType<tipoLink[]>,
      default: () => []
    },
    exibirBtnVoltar: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    homeUrlName: {
      type: String,
      default: "dashboard",
    },
    padding: {
      type: String,
      required: false,
      default: null
    },
    componentLink: {
      type: String,
      default: "router-link",
      validator(value: string) {
        return ["a","Link","router-link"].includes(value);
      },
    },
  },
  components: { ArrowSidebar, HomeIcon, BaseButtonTertiary, CaptionText },
  methods: {
    voltar() {
      this.$emit("voltar");
    },
  },
  created() {},
});
</script>

<style scoped>
.subheader {
  display: flex;
  flex-direction: column;
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);

  background: var(--gray-color-200);
}

.subheader-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.botoes {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 12px;
}

.titulo {
  font-size: 1.25rem;
  line-height: 24px;
  color: var(--primary-color-principal);
  font-weight: bold;
  flex-shrink: 0;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

.breadcrumb-separador {
  color: #606266;
}

.links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.links .breadcrumb-item {
  font-size: 0.875rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

.links .breadcrumb-item:hover {
  opacity: 0.6;
}


.links .breadcrumb-item:not(:last-child) {
  color: #606266;
}

.links .atual *,
.links .atual :deep(*){
  color: var(--primary-color-principal) !important;
}

.links .atual path {
  fill: var(--primary-color-principal);
}
</style>
