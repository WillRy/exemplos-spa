<script setup>
import { RouterView } from "vue-router";
</script>

<template>
    <RouterView key="principal"/>
</template>

<style>

#nprogress .bar {
  background: var(--warning-color-700) !important;
  height: 5px !important;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;

  width: 100%;
}

#nprogress .peg { 
  box-shadow: 0 0 10px var(--warning-color-700), 0 0 5px var(--warning-color-700) !important;;
}

#nprogress .spinner-icon {
  border-top-color: var(--warning-color-700) !important;;
  border-left-color: var(--warning-color-700) !important;;
}

</style>
