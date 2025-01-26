<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.284 18.284" :style="{height: size, width: size}">
    <path
        d="M17.237,1.5H5.046A3.047,3.047,0,0,0,2,4.547V16.736a3.047,3.047,0,0,0,3.047,3.048h6.1v-8H8.856V9.5h2.286V7.785A2.857,2.857,0,0,1,14,4.928h2.857V7.213H14a.571.571,0,0,0-.571.571V9.5H16.57L16,11.785H13.427v8h3.81a3.047,3.047,0,0,0,3.047-3.048V4.547A3.047,3.047,0,0,0,17.237,1.5Z"
        transform="translate(-1.999 -1.5)"
        :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: "FacebookIcon",
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