<template>
  <div class="home-container">
    <slot name="sidebar"> </slot>
    <slot name="header"></slot>
    <div class="home" :class="{ temSidebar: $slots.sidebar }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomeContainer'
}
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.home {
  top: 0;
  transition: all 0.5s ease;
  padding-top: 60px;
  width: 100%;
  height: 100%;
}

.temSidebar {
  padding-left: 60px;
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
