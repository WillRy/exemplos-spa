<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Componente_118_1"
    data-name="Componente 118 – 1"
    viewBox="0 0 12.324 18"
    :style="{ height: size, width: size }"
  >
    <path
      id="Caminho_4116"
      data-name="Caminho 4116"
      d="M2.476,18A2.553,2.553,0,0,1,0,15.361V2.6A2.537,2.537,0,0,1,2.434,0H9.848a2.553,2.553,0,0,1,2.473,2.639V15.4A2.537,2.537,0,0,1,9.893,18ZM2.5,2a.542.542,0,0,0-.5.561V15.4a.554.554,0,0,0,.517.6h7.33a.537.537,0,0,0,.474-.561V2.6A.553.553,0,0,0,9.805,2Z"
      transform="translate(0)"
      :fill="color"
    />
    <path
      id="Caminho_4117"
      data-name="Caminho 4117"
      d="M6.166,14.8a1.011,1.011,0,0,1-.93-1.381,1.023,1.023,0,0,1,.22-.319.877.877,0,0,1,.32-.221,1.026,1.026,0,0,1,.77,0,1.076,1.076,0,0,1,.54.54.976.976,0,0,1-.22,1.091.971.971,0,0,1-.7.29"
      transform="translate(0)"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#35528C'
    }
  }
}
</script>

<style scoped></style>
