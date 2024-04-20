<template>
  <div class="alert-info">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>

    <p><slot></slot></p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AlertInfo'
}
</script>

<style scoped>
svg {
  height: 16px;
  width: 16px;
  fill: #0c5460;
}

.alert-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: var(--radius-principal);
  border: 1px solid #bee5eb;
  background: #d1ecf1;
  color: #0c5460;
  margin: 12px 0;
}

.alert-info p {
  line-height: 1;
  margin: 0;
}
</style>
