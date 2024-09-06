<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :style="{ height: size, width: size }"
  >
    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" :fill="color" />
  </svg>
</template>

<script>
export default {
  name: 'ArrowRightIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#898C99'
    }
  }
}
</script>

<style scoped></style>
