<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19.605 14.446"
    :style="{ height: size, width: size }"
  >
    <path
      d="M15.882,7H3.5V9.064H15.882Zm0,4.127H3.5v2.064H15.882ZM3.5,17.318h8.255V15.255H3.5ZM17.946,7v8.44a3.09,3.09,0,1,0,2.064,2.91V9.064h3.1V7Z"
      transform="translate(-3.5 -7)"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'MusicasIcon',
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
