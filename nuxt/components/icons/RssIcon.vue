<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.087 19.087" :style="{height: size, width: size}">
    <path
        id="Icon_awesome-rss-square"
        data-name="Icon awesome-rss-square"
        d="M17.042,1.75h-15A2.045,2.045,0,0,0,0,3.8v15a2.045,2.045,0,0,0,2.045,2.045h15a2.045,2.045,0,0,0,2.045-2.045V3.8A2.045,2.045,0,0,0,17.042,1.75ZM4.772,18.11a2.045,2.045,0,1,1,2.045-2.045A2.045,2.045,0,0,1,4.772,18.11Zm6.712,0H10.021a.487.487,0,0,1-.487-.453A6.819,6.819,0,0,0,3.18,11.3a.487.487,0,0,1-.453-.487V9.354a.487.487,0,0,1,.511-.487A9.254,9.254,0,0,1,11.97,17.6.487.487,0,0,1,11.483,18.11Zm4.389,0H14.41a.488.488,0,0,1-.487-.47A11.2,11.2,0,0,0,3.2,6.914a.488.488,0,0,1-.47-.487V4.964a.486.486,0,0,1,.5-.487A13.643,13.643,0,0,1,16.36,17.608a.486.486,0,0,1-.487.5Z"
        transform="translate(0 -1.75)"
        :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: "RssIcon",
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