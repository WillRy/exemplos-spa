<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         :style="{height: size, width: size}" viewBox="0 0 24 24">
        <path d="M19 7H22L18 3L14 7H17V21H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z" :fill="color"/>
    </svg>
</template>

<script>
export default {
    name: "SortDescIcon",
    props: {
        size: {
            type: String,
            default: '24px'
        },
        color: {
            type: String,
            default: '#35528C'
        },
    }
}
</script>

<style scoped>

</style>
