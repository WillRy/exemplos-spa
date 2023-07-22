<template>
    <div class="home">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "HomeContainer"
  }
  </script>
  
  <style>
  
  .home {
    min-height: 100vh;
    top: 0;
    padding-left: 70px;
    transition: all 0.5s ease;
    z-index: var(--z-index-1);
    padding-top: 60px;
  }
  
  .sidebar.open ~ .home {
    padding-left: 250px;
  }
  
  .sidebar ~ .header .paddingSidebar{
    padding-left: 70px;
  }
  
  .sidebar.open ~ .header .paddingSidebar {
    padding-left: 250px;
  }
  </style>
  