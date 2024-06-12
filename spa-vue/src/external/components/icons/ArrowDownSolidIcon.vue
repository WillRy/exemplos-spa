<template>
  <svg xmlns="http://www.w3.org/2000/svg" :style="{ height: size, width: size }" viewBox="0 0 18 9">
    <path id="Icon_ionic-md-arrow-dropdown" data-name="Icon ionic-md-arrow-dropdown" d="M9,13.5l9,9,9-9Z" transform="translate(-9 -13.5)" :fill="color"/>
  </svg>
</template>

<script>
export default {
  name: "ArrowDownSolidIcon",
  props: {
    size: {
      type: String,
      default: "24px",
    },
    color: {
      type: String,
      default: "#4871c2",
    },
  },
};
</script>

<style scoped></style>
