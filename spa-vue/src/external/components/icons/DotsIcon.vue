<template>
  <svg viewBox="0 0 24 24" :style="{ height: size, width: size }">
    <path
      d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'DotsIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#707070'
    }
  }
}
</script>

<style scoped></style>
