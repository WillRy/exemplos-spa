<template>
    <DynamicThemeProvider :theme-config="{
        primaryColor: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b'
        },
        escalaPrimaryColorPrincipal: 700,
    }">
        <div class="layout-publico">

            <slot />

        </div>
    </DynamicThemeProvider>
</template>

<script setup>
import DynamicThemeProvider from "~/provider/DynamicThemeProvider.vue";


</script>

<style scoped>
.layout-publico {
    height: 100vh;
    background: #f2f2f2;

    display: flex;
    align-items: center;
    justify-content: center;
}

.loader-overlay {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>