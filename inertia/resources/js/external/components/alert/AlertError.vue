<template>
  <div class="alert-error">
    <svg xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      />
    </svg>

    <p><slot></slot></p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Alerterror'
}
</script>

<style scoped>
svg {
  height: 16px;
  width: 16px;
  fill: #58151c;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: var(--radius-principal);
  border: 1px solid #f1aeb5;
  background: #f8d7da;
  color: #58151c;
  margin: 12px 0;
}

.alert-error p {
  line-height: 1;
  margin: 0;
}
</style>
