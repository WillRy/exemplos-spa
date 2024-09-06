<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :style="{ height: size, width: size }"
  >
    <path
      d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'InfoSuccessIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#31B383'
    }
  }
}
</script>

<style scoped></style>
