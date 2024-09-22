<template>
    <div>
        <pre>
            {{ contato }}
        </pre>

        <button @click="refresh">Recarregar</button>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'privado',
})
const contato = ref(null)

const {data, error, refresh} = useAsyncData('contato', async () => {
    const $route = useRoute();
    return useNuxtApp().$fetchApi('/contato/' + $route.params.id, {
        headers: {
            'Teste': 'Teste'
        }
    })
})  

watchEffect(() => {
    contato.value = data?.value?.data
})
</script>