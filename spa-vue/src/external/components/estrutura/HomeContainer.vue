<template>
  <div class="home">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "HomeContainer",
};
</script>

<style>
.home {
  min-height: 100vh;
  top: 0;
  transition: all 0.5s ease;
  z-index: var(--z-index-1);
  padding-bottom: 20px;
  padding-left: 60px;
  padding-top: 60px;
}

.sidebar.open ~ .home {
  padding-left: 250px;
}

.sidebar ~ .header .paddingSidebar {
  padding-left: 70px;
}

.sidebar.open ~ .header .paddingSidebar {
  padding-left: 250px;
}
</style>
