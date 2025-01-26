<template>
    <div class="separador">
      <div class="conteudo">
        <slot></slot>
      </div>
      <div class="separador-barra"></div>
    </div>
  </template>
  
  <script setup></script>
  
  <style scoped>
  .separador .conteudo {
    font-size: 12px;
    margin-bottom: var(--spacing-1);
    padding-left: 20px;
    color: #bbbfc4;
  }
  
  .separador-barra {
    display: block;
    height: 1px;
    width: 100%;
    border: 1px solid #bbbfc4;
    opacity: 0.4;
  }
  </style>
  