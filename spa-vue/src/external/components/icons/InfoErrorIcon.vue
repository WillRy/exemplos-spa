<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="{ height: size, width: size }"
    viewBox="0 0 24 24"
  >
    <path
      d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'InfoErrorIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#C22121'
    }
  }
}
</script>

<style scoped></style>
