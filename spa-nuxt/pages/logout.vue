<template>
    <div></div>
</template>
<script setup>
const router = useRouter();
fetch("/logout").then(() => {
    router.push({
        path: '/login'
    })
})
</script>