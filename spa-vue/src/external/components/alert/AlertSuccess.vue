<template>
  <div class="alert-success">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
      />
    </svg>
    <p><slot></slot></p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AlertSuccess'
}
</script>

<style scoped>
svg {
  height: 16px;
  width: 16px;
  fill: #0a3622;
}

.alert-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: var(--radius-principal);
  border: 1px solid #a3cfbb;
  background: #d1e7dd;
  color: #0a3622;
  margin: 12px 0;
}

.alert-success p {
  line-height: 1;
  margin: 0;
}
</style>
