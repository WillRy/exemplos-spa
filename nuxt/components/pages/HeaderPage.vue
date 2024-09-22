<template>
    <div class="header-page">
      <h3 class="titulo" v-if="titulo">{{ titulo }}</h3>
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderPage',
    props: ['titulo']
  }
  </script>
  
  <style scoped>
  .header-page {
    background: #fff;
    border-bottom: 1px solid #dddddd;
    padding: 20px;
  
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }
  
  h3 {
    margin: 0;
    color: var(--primary-color-600);
  }
  </style>
  