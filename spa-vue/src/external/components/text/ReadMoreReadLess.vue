<template>
  <div>
    <div :class="{ 'corte-automatico': !isOpen }" ref="textContent" v-if="html" v-html="html"></div>
    <div v-else :class="{ 'corte-automatico': !isOpen }" ref="textContent">
      <slot />
    </div>

    <button v-if="showButtons && !isOpen" @click="isOpen = true">Read More</button>
    <button v-if="showButtons && isOpen" @click="isOpen = false">Read Less</button>
  </div>
</template>
<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  html: String,
  numberOfLines: {
    type: Number,
    default: 3
  },
  observerForever: {
    type: Boolean,
    default: true
  }
})

//ref atribuida ao elemento html (no DOM)
const textContent = ref(null)

//está cortado ou não
const shouldCutText = ref(false)
const isClamped = ref(false)

//se abriu o texto
const isOpen = ref(false)

const showButtons = computed(() => shouldCutText.value)

const observer = ref(null)

//verifica se houve corte
const checkIsTextClamped = (elm) => elm.scrollHeight > elm.clientHeight

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
// verifica se houve corte ao montar o componente
onMounted(() => {
  shouldCutText.value = checkIsTextClamped(textContent.value)
  isClamped.value = checkIsTextClamped(textContent.value)

  //observa redimensionamento para verificar se houve corte e alimentar variavel de controle
  observer.value = new ResizeObserver((e) => {
    isClamped.value = checkIsTextClamped(e[0].target)

    if (!shouldCutText.value && isClamped.value) {
      shouldCutText.value = true
    }

    if (!props.observerForever && observer.value) {
      observer.value.disconnect()
    }
  })

  observer.value.observe(textContent.value)
})
</script>
<style scoped>
.corte-automatico {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: v-bind(numberOfLines);
}

button {
  color: #3b82f6;
}
</style>
