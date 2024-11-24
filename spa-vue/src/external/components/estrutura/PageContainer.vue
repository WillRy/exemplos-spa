<template>
  <div class="page-container"
    :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';


interface Props {
  containerFluido: boolean,
  center: boolean,
  paddingTop: boolean
}

const props = withDefaults(defineProps<Props>(), {
  containerFluido: false,
  center: false,
  paddingTop: false
})

const classes = computed(() => {
  const classesPadroes = { 'container-fluid': props.containerFluido, 'container': !props.containerFluido, 'center': props.center }
  if(props.paddingTop) {
    return { ...classesPadroes, 'pt-4': true }
  }

  return classesPadroes
})
</script>

<style scoped>
.page-container {
  margin-top: var(--spacing-4);
  padding-bottom: 20px;
}

.center {
  margin: 0 auto;
}
</style>
