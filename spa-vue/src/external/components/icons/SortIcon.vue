<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :style="{ height: size, width: size }"
    viewBox="0 0 24 24"
  >
    <path
      d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'SortIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#adadad'
    }
  }
}
</script>

<style scoped></style>
