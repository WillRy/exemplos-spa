<template>
    <div class="organizacoes">
        <HeaderPage titulo="Organizações"> </HeaderPage>
        <PageContainer :container-fluido="true">
            <ListagemOrganizacao/>
        </PageContainer>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'privado',
})

useSeoMeta({
    title: 'Organizações',
    description: 'Listagem de organizações cadastradas no sistema'
})
</script>