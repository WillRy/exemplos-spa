<template>
  <div class="login">

  </div>
</template>

<script setup>

definePageMeta({layout: 'publico', middleware: ['guest']})

let {value: token} = useCookie('token');

if(!token) {
  navigateTo('/login')
}


</script>

<style scoped>
.login {
  max-width: 360px;
  width: 100%;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 20px;
  border-radius: 8px;
}

.login h3 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  text-align: center;
  color: var(--primary-color-500);
}

a {
  text-decoration: none;
  color: var(--primary-color-500);
  display: block;
  text-align: center;
}

a:visited {
  color: var(--primary-color-500);
}

a:hover {
  opacity: 0.6;
}
</style>
