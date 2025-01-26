<template>
  <svg xmlns="http://www.w3.org/2000/svg" :style="{height: size, width: size}" viewBox="0 0 7.21 19.227">
    <path
        d="M3.9,18.626V.6A.6.6,0,0,0,3.3,0H2.1a.6.6,0,0,0-.6.6V18.626a.6.6,0,0,0,.6.6H3.3A.6.6,0,0,0,3.9,18.626Zm4.807,0V.6a.6.6,0,0,0-.6-.6h-1.2a.6.6,0,0,0-.6.6V18.626a.6.6,0,0,0,.6.6h1.2A.6.6,0,0,0,8.71,18.626Z"
        transform="translate(-1.5)"
        :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: "BarraInformacaoIcon",
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#35528C'
    },
  }
}
</script>

<style scoped>
</style>