<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.389 16.783" :style="{height: size, width: size}">
    <g id="Icon_feather-monitor" data-name="Icon feather-monitor" transform="translate(1.167 1.167)">
      <path id="Caminho_4101" data-name="Caminho 4101"
            d="M3.939,2.333H16.783a2.775,2.775,0,0,1,2.772,2.772v8.028a2.775,2.775,0,0,1-2.772,2.772H3.939a2.775,2.775,0,0,1-2.772-2.772V5.106A2.775,2.775,0,0,1,3.939,2.333ZM16.783,13.572a.439.439,0,0,0,.439-.439V5.106a.439.439,0,0,0-.439-.439H3.939a.439.439,0,0,0-.439.439v8.028a.439.439,0,0,0,.439.439Z"
            transform="translate(-2.333 -3.5)" :fill="color"/>
      <path id="Caminho_4102" data-name="Caminho 4102"
            d="M15.755,25.667H9.333a1.167,1.167,0,0,1,0-2.333h6.422a1.167,1.167,0,1,1,0,2.333Z"
            transform="translate(-4.517 -10.05)" :fill="color"/>
      <path id="Caminho_4103" data-name="Caminho 4103"
            d="M14,24.211a1.167,1.167,0,0,1-1.167-1.167V19.833a1.167,1.167,0,1,1,2.333,0v3.211A1.167,1.167,0,0,1,14,24.211Z"
            transform="translate(-5.972 -8.595)" :fill="color"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "PlayerIcon",
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