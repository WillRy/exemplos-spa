<template>
  <div class="breadcrumb">
    <div class="links">
      <template v-for="(link, index) in links" :key="index">
        <span class="breadcrumb-separador" v-if="index !== 0">></span>
        <component
          class="breadcrumb-item"
          :is="componentLink"
          :class="{ atual: index == links.length - 1 }"
          size="sm"
          @click="clicou(link)"
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
  </div>
</template>

<script>
import BaseButtonTertiary from './../buttons/BaseButtonTertiary.vue';
import CaptionText from './../text/CaptionText.vue';

export default {
    name: "Breadcrumb",
    props: {
        links: {
            type: Array,
            default: () => [],
        },
        componentLink: {
            type: String,
            default: "a",
        },
    },
    methods: {
        clicou(link) {
            this.$emit("change", link);
        },
    },
    components: { BaseButtonTertiary, CaptionText }
};
</script>

<style scoped>
.breadcrumb {
  padding: 16px 20px;
  background: #e1e2e6;

  display: flex;
  align-items: center;
  gap: 6px;
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
  color: var(--primary-color-principal);
}

.links .atual path {
  fill: var(--primary-color-principal);
}

.breadcrumb-nome {
  line-height: 0;
}
</style>
